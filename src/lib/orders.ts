import { prisma } from "./db";
import { generateOrderNumber } from "./api-utils";
import { findOrCreateCustomer } from "./customers";
import { notifyAdmins, notifyCustomer } from "./notifications";
import { moveOpportunityStage } from "./pipeline";
import type { OrderStatus, PaymentStatus } from "@/generated/prisma/client";

interface CheckoutInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress: Record<string, string>;
  billingAddress?: Record<string, string>;
  paymentMethod: string;
  guestCheckout: boolean;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    configuration?: Record<string, string>;
  }[];
  userId?: string;
}

export async function createOrder(input: CheckoutInput) {
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderItems = input.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Produkt ${item.productId} nicht gefunden`);
    return {
      productId: item.productId,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: item.quantity,
      configuration: item.configuration ? JSON.stringify(item.configuration) : null,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 149;
  const tax = Math.round(subtotal * 0.2 * 100) / 100;
  const total = subtotal + shipping + tax;

  const customer = await findOrCreateCustomer({
    email: input.email,
    name: `${input.firstName} ${input.lastName}`,
    phone: input.phone,
    userId: input.userId,
  });

  const initialStatus: OrderStatus =
    input.paymentMethod === "invoice" || input.paymentMethod === "bank_transfer"
      ? "PAYMENT_PENDING"
      : "CREATED";

  const initialPaymentStatus: PaymentStatus =
    input.paymentMethod === "invoice" || input.paymentMethod === "bank_transfer"
      ? "INVOICE_SENT"
      : "PENDING";

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: input.userId,
      customerId: customer.id,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      status: initialStatus,
      paymentStatus: initialPaymentStatus,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: JSON.stringify(input.shippingAddress),
      billingAddress: input.billingAddress ? JSON.stringify(input.billingAddress) : null,
      paymentMethod: input.paymentMethod,
      guestCheckout: input.guestCheckout,
      notes: input.notes,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  await notifyCustomer(
    customer.id,
    "ORDER_UPDATE",
    "Bestellung eingegangen",
    `Ihre Bestellung ${order.orderNumber} wurde erfasst. Wir melden uns bei Ihnen.`
  );

  await notifyAdmins(
    "NEW_ORDER",
    "Neue Bestellung",
    `${order.orderNumber} — ${input.firstName} ${input.lastName} · €${total.toFixed(2)}`,
    { orderId: order.id }
  );

  return order;
}

async function provisionVehiclesForOrder(
  userId: string,
  items: {
    productId: string;
    name: string;
    configuration: string | null;
    product?: { productType: string } | null;
  }[]
) {
  const vehicleItems = items.filter((item) => item.product?.productType === "VEHICLE");
  for (const item of vehicleItems) {
    const existing = await prisma.userVehicle.findFirst({
      where: { userId, productId: item.productId },
    });
    if (!existing) {
      const warrantyUntil = new Date();
      warrantyUntil.setFullYear(warrantyUntil.getFullYear() + 2);
      await prisma.userVehicle.create({
        data: {
          userId,
          productId: item.productId,
          productName: item.name,
          configSnapshot: item.configuration,
          purchaseDate: new Date(),
          warrantyUntil,
        },
      });
    }
  }
}

async function advancePipelineForOrder(customerId: string) {
  const opportunity = await prisma.salesOpportunity.findFirst({
    where: {
      customerId,
      stage: { in: ["OFFER_SENT", "CONFIGURATION_CREATED", "NEEDS_ANALYSIS"] },
    },
    orderBy: { updatedAt: "desc" },
  });
  if (opportunity) {
    await moveOpportunityStage(opportunity.id, "ORDER_CONFIRMED");
  }
}

export async function fulfillPaidOrder(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID", status: "CONFIRMED" },
    include: { items: { include: { product: true } }, customer: true },
  });

  if (order.userId) {
    await provisionVehiclesForOrder(order.userId, order.items);
  }

  if (order.customerId) {
    await advancePipelineForOrder(order.customerId);
    await notifyCustomer(
      order.customerId,
      "ORDER_UPDATE",
      "Zahlung eingegangen",
      `Ihre Bestellung ${order.orderNumber} wurde bezahlt und bestätigt.`
    );
  }

  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { customer: true, items: { include: { product: true } } },
  });

  if (order.customerId) {
    await notifyCustomer(
      order.customerId,
      "ORDER_UPDATE",
      "Bestellstatus aktualisiert",
      `Ihre Bestellung ${order.orderNumber} ist jetzt: ${status}`
    );
  }

  if (
    order.userId &&
    (status === "CONFIRMED" || status === "COMPLETED")
  ) {
    await provisionVehiclesForOrder(order.userId, order.items);
    if (status === "CONFIRMED" && order.customerId) {
      await advancePipelineForOrder(order.customerId);
    }
  }

  return order;
}

export async function getOrdersForCustomer(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminDashboardStats() {
  const [
    newInquiries,
    openOpportunities,
    pendingOffers,
    activeOrders,
    openService,
    revenue,
    recentOrders,
    recentRequests,
  ] = await Promise.all([
    prisma.customRequest.count({ where: { status: "NEW" } }),
    prisma.salesOpportunity.count({
      where: { stage: { not: "COMPLETED" } },
    }),
    prisma.offer.count({ where: { status: "SENT" } }),
    prisma.order.count({
      where: { status: { in: ["CREATED", "PAYMENT_PENDING", "CONFIRMED", "PROCESSING", "SHIPPING"] } },
    }),
    prisma.serviceRequest.count({
      where: { status: { not: "COMPLETED" } },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.customRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true, customer: true },
    }),
  ]);

  return {
    newInquiries,
    openOpportunities,
    pendingOffers,
    activeOrders,
    openService,
    revenue: revenue._sum.total ?? 0,
    recentOrders,
    recentRequests,
  };
}
