/**
 * QR URL & route helpers for MeltOra Customer Root (/) and Admin (/meltora-br-admin).
 */

export function isAdminPath() {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/meltora-br-admin");
}

export function getHomeWebsiteUrl() {
  if (typeof window === "undefined") return "/";
  return `${window.location.origin}/`;
}

export function getProductScanUrl(productId) {
  if (typeof window === "undefined") return `/?scan=${encodeURIComponent(productId)}`;
  const url = new URL(window.location.origin + "/");
  url.searchParams.set("scan", productId);
  return url.toString();
}

export function readRouteFromUrl() {
  if (typeof window === "undefined") {
    return { page: "home", scanId: null, productId: null, category: "all" };
  }

  const params = new URLSearchParams(window.location.search);
  const scanId = params.get("scan");
  const productId = params.get("product");
  const pageParam = params.get("page");
  const category = params.get("category") || "all";

  if (scanId) {
    return { page: "product", scanId, productId: scanId, category };
  }
  if (productId) {
    return { page: "product", scanId: null, productId, category };
  }
  if (["home", "explore", "scan"].includes(pageParam)) {
    return { page: pageParam, scanId: null, productId: null, category };
  }

  return { page: "home", scanId: null, productId: null, category };
}

export function syncUrlWithRoute({ page, productId, scanId, category, isAdmin = false }) {
  if (typeof window === "undefined") return;
  const basePath = isAdmin ? "/meltora-br-admin" : "/";
  const url = new URL(window.location.origin + basePath);

  if (page === "product" && (scanId || productId)) {
    url.searchParams.set(scanId ? "scan" : "product", scanId || productId);
  } else if (page === "explore") {
    url.searchParams.set("page", "explore");
    if (category && category !== "all") {
      url.searchParams.set("category", category);
    }
  } else if (page === "scan") {
    url.searchParams.set("page", "scan");
  }

  window.history.replaceState({}, "", url.toString());
}
