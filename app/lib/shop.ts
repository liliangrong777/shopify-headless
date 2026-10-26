// ─────────────────────────────────────────────────────────────────────────────
// Store configuration.
//
// Mode is auto-detected per request (see `shouldUseMockShop` below):
//   • Real store — used when PUBLIC_STORE_DOMAIN is a real shop. A private token
//     uses the private client; otherwise the public token uses the public client.
//   • mock.shop — forced by MOCK_SHOP=1, a mock.shop host, or no store domain.
//
// `storeDomain` below is the default used only when PUBLIC_STORE_DOMAIN is unset.
// It points at Shopify's public Hydrogen Preview store as an EXAMPLE — replace it
// or set PUBLIC_STORE_DOMAIN. (mock.shop is a different data source.)
// ─────────────────────────────────────────────────────────────────────────────

import type { ShopAnalytics, ShopifyScriptsShop } from "@shopify/hydrogen";

export const storefrontConfig = {
  storeDomain: "hydrogen-preview.myshopify.com", // ← default; or set PUBLIC_STORE_DOMAIN
  i18n: { country: "US", language: "EN" },
} as const;

// mock.shop only when forced, when the domain is a mock.shop host, or when no
// store domain is set. A real domain with only a public token still uses that store.
export function shouldUseMockShop(
  env: Pick<Env, "MOCK_SHOP" | "PUBLIC_STORE_DOMAIN">,
): boolean {
  return (
    env.MOCK_SHOP === "1" ||
    !env.PUBLIC_STORE_DOMAIN ||
    isMockShopDomain(env.PUBLIC_STORE_DOMAIN)
  );
}

// mock.shop is a catalog of stores, not one store. The default store at mock.shop
// sells apparel basics; every other store lives on its own host (pets.mock.shop,
// snowboards.mock.shop, ...) and is listed at https://mock.shop/llms.txt.
export const MOCK_SHOP_DOMAIN = "mock.shop";

export function isMockShopDomain(domain: string | undefined): domain is string {
  return domain === MOCK_SHOP_DOMAIN || Boolean(domain?.endsWith(`.${MOCK_SHOP_DOMAIN}`));
}

// Store domain for mock mode: a mock.shop host in PUBLIC_STORE_DOMAIN selects that
// store's catalog; anything else means the default store.
export function getMockShopDomain(env: Pick<Env, "PUBLIC_STORE_DOMAIN">): string {
  return isMockShopDomain(env.PUBLIC_STORE_DOMAIN) ? env.PUBLIC_STORE_DOMAIN : MOCK_SHOP_DOMAIN;
}

// Store domain for real-store mode: prefer the worker env (Oxygen injects
// PUBLIC_STORE_DOMAIN for a linked storefront), else the configured default.
export function getStoreDomain(env: Pick<Env, "PUBLIC_STORE_DOMAIN">): string {
  return env.PUBLIC_STORE_DOMAIN || storefrontConfig.storeDomain;
}

// Shop identity for Shopify scripts and analytics. The shop ID comes from the
// Storefront API, the storefront ID from PUBLIC_STOREFRONT_ID, and the domain is
// the one the storefront client queries. Only a real store with a storefront ID
// loads Shopify's analytics (`hydrogen` channel); otherwise events stay local
// (`headless`), and the empty script `storefrontId` means "none".
export type ShopIdentity = {
  scriptShop: ShopifyScriptsShop;
  analyticsShop: ShopAnalytics;
  shopifyAnalytics: boolean;
};

export function resolveShopIdentity(
  env: Pick<
    Env,
    "MOCK_SHOP" | "PRIVATE_STOREFRONT_API_TOKEN" | "PUBLIC_STORE_DOMAIN" | "PUBLIC_STOREFRONT_ID"
  >,
  shopId: string,
): ShopIdentity {
  if (shouldUseMockShop(env)) {
    return {
      scriptShop: { shopId, storefrontId: "", myshopifyDomain: getMockShopDomain(env) },
      analyticsShop: { shopId, channel: "headless" },
      shopifyAnalytics: false,
    };
  }

  const storefrontId = env.PUBLIC_STOREFRONT_ID ?? "";
  return {
    scriptShop: { shopId, storefrontId, myshopifyDomain: getStoreDomain(env) },
    analyticsShop: storefrontId
      ? { shopId, channel: "hydrogen", storefrontId }
      : { shopId, channel: "headless" },
    shopifyAnalytics: storefrontId !== "",
  };
}

// Use Shopify's default consent banner and Customer Privacy behavior.
export const analyticsConsent = {
  mode: "default-banner",
  country: "US",
  language: "EN",
} as const;

// Private Storefront API token for SSR requests. Read from the worker environment
// so a standalone clone supplies it via .env / Oxygen bindings. Never commit a
// real token.
export function getPrivateStorefrontToken(env: Pick<Env, "PRIVATE_STOREFRONT_API_TOKEN">): string {
  const token = env.PRIVATE_STOREFRONT_API_TOKEN;
  if (!token) {
    throw new Error(
      "PRIVATE_STOREFRONT_API_TOKEN is required for SSR requests against a real store. " +
        "Set it in your environment (see .env.example), or run with MOCK_SHOP=1 for the tokenless mock.shop demo.",
    );
  }
  return token;
}

// Buyer IP for private Storefront clients (Shopify uses it for bot/abuse
// signals). Returns the first trusted forwarded IP; falls back to localhost in
// development and throws in production when none is present.
const BUYER_IP_HEADERS = ["oxygen-buyer-ip", "cf-connecting-ip", "x-forwarded-for"] as const;
export const DEVELOPMENT_BUYER_IP = "127.0.0.1";

export function getBuyerIp(headers: Pick<Headers, "get">): string {
  for (const header of BUYER_IP_HEADERS) {
    const ip = headers.get(header)?.split(",")[0]?.trim();
    if (ip) return ip;
  }
  if (process.env.NODE_ENV !== "production") return DEVELOPMENT_BUYER_IP;
  throw new Error(`${BUYER_IP_HEADERS.join(", ")} is required for private Storefront API clients`);
}
