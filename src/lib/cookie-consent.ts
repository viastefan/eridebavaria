export type CookieCategory = "necessary" | "analytics" | "marketing";

export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

const STORAGE_KEY = "eride-cookie-consent";

export const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  decidedAt: "",
};

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveCookiePreferences(prefs: Omit<CookiePreferences, "decidedAt">) {
  const data: CookiePreferences = {
    ...prefs,
    necessary: true,
    decidedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: data }));
  return data;
}

export function acceptAllCookies() {
  return saveCookiePreferences({ necessary: true, analytics: true, marketing: true });
}

export function denyOptionalCookies() {
  return saveCookiePreferences({ necessary: true, analytics: false, marketing: false });
}
