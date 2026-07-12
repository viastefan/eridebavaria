import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
  firstName: z.string().min(1, "Vorname erforderlich"),
  lastName: z.string().min(1, "Nachname erforderlich"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Straße erforderlich"),
  city: z.string().min(1, "Stadt erforderlich"),
  postalCode: z.string().min(4, "PLZ erforderlich"),
  country: z.string().min(2).default("DE"),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(["card", "apple_pay", "google_pay", "invoice", "bank_transfer", "paypal"]),
  guestCheckout: z.boolean().default(true),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(99),
        configuration: z.record(z.string(), z.string()).optional(),
      })
    )
    .min(1),
});

export const garagePinSchema = z.object({
  pin: z.string().min(6, "PIN erforderlich").max(24),
});

export type GaragePinInput = z.infer<typeof garagePinSchema>;
