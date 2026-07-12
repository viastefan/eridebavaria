import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import {
  type GarageAccessData,
  type GarageDocument,
  type GarageServiceEntry,
  type GarageSession,
  normalizeGaragePin,
} from "./garage-types";

const COOKIE_NAME = "eride-garage";
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "production" ? undefined : "eride-dev-garage-secret");
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type { GarageAccessData, GarageSession } from "./garage-types";

export async function hashGaragePin(pin: string) {
  return bcrypt.hash(normalizeGaragePin(pin), 12);
}

export async function verifyGaragePin(pin: string, hash: string) {
  return bcrypt.compare(normalizeGaragePin(pin), hash);
}

export async function createGarageSession(access: {
  id: string;
  productSlug: string;
  productName: string;
  customerName: string | null;
}) {
  const token = await new SignJWT({
    accessId: access.id,
    productSlug: access.productSlug,
    productName: access.productName,
    customerName: access.customerName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function destroyGarageSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getGarageSession(): Promise<GarageSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      accessId: payload.accessId as string,
      productSlug: payload.productSlug as string,
      productName: payload.productName as string,
      customerName: (payload.customerName as string) ?? null,
    };
  } catch {
    return null;
  }
}

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function mapGarageAccess(record: {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  customerName: string | null;
  vin: string | null;
  purchaseDate: Date | null;
  warrantyUntil: Date | null;
  batteryHealth: number;
  nextServiceDate: Date | null;
  serviceLog: string;
  documents: string;
}): GarageAccessData {
  return {
    id: record.id,
    productId: record.productId,
    productSlug: record.productSlug,
    productName: record.productName,
    customerName: record.customerName,
    vin: record.vin,
    purchaseDate: record.purchaseDate?.toISOString() ?? null,
    warrantyUntil: record.warrantyUntil?.toISOString() ?? null,
    batteryHealth: record.batteryHealth,
    nextServiceDate: record.nextServiceDate?.toISOString() ?? null,
    serviceLog: parseJsonArray<GarageServiceEntry>(record.serviceLog, []),
    documents: parseJsonArray<GarageDocument>(record.documents, []),
  };
}

export async function getGarageAccessData(accessId: string) {
  const record = await prisma.garageAccess.findFirst({
    where: { id: accessId, active: true },
  });
  if (!record) return null;
  return mapGarageAccess(record);
}

export async function loginWithGaragePin(pin: string) {
  const normalized = normalizeGaragePin(pin);
  if (normalized.length < 6) {
    return { ok: false as const, error: "PIN zu kurz. Bitte vollständigen Code eingeben." };
  }

  const records = await prisma.garageAccess.findMany({ where: { active: true } });
  const now = new Date();

  for (const record of records) {
    if (record.lockedUntil && record.lockedUntil > now) {
      continue;
    }

    const match = await verifyGaragePin(pin, record.pinHash);
    if (!match) continue;

    await prisma.garageAccess.update({
      where: { id: record.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: now,
      },
    });

    await createGarageSession({
      id: record.id,
      productSlug: record.productSlug,
      productName: record.productName,
      customerName: record.customerName,
    });

    return { ok: true as const, access: mapGarageAccess(record) };
  }

  return { ok: false as const, error: "PIN ungültig. Bitte Code aus Ihren Kaufunterlagen prüfen." };
}
