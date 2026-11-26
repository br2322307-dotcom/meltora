/**
 * WhatsApp & Direct Call routing helpers for MeltOra.
 * Supports separate WhatsApp numbers per category (Chocolate vs Desi Ghee)
 * as well as a combined MeltOra WhatsApp Group option.
 */

export function sanitizePhoneDigits(raw) {
  return String(raw || "").replace(/[^0-9]/g, "");
}

export function buildProductWhatsAppMessage({
  product,
  quantity = 1,
  customerName = "",
  fromScan = false,
}) {
  const name = product?.fullName || product?.full_name || "MeltOra Product";
  const weight = product?.weight ? ` (${product.weight})` : "";
  const price = product?.price ? ` - ₹${product.price}` : "";
  const sourceTag = fromScan ? " [QR Scan]" : "";
  const customerPart = customerName?.trim()
    ? ` | Name: ${customerName.trim()}`
    : "";

  return `Hello MeltOra!${sourceTag} I'm interested in *${name}*${weight}${price} | Qty: ${quantity}${customerPart}. Please share details / confirm availability.`;
}

export function getWhatsAppRedirectUrl({
  category = "chocolate",
  routingMode = "category",
  chocolateWhatsappNumber = "919876543210",
  gheeWhatsappNumber = "919876543211",
  whatsappGroupLink = "",
  message = "",
  forceMode = null,
}) {
  const mode = forceMode || routingMode || "category";
  if (mode === "group" && whatsappGroupLink) {
    return whatsappGroupLink;
  }

  const rawNumber =
    category === "ghee" ? gheeWhatsappNumber : chocolateWhatsappNumber;
  const digits = sanitizePhoneDigits(rawNumber);

  if (!digits) {
    return whatsappGroupLink || "https://wa.me/";
  }

  const encoded = encodeURIComponent(
    message || "Hello MeltOra! I would like to explore & order your products."
  );
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function getWhatsAppDeskLabel(category, state) {
  if (state.whatsappRoutingMode === "group") {
    return "MeltOra Official Group";
  }
  return category === "ghee"
    ? `Desi Ghee WhatsApp (${state.gheeWhatsappNumber})`
    : `Chocolate WhatsApp (${state.chocolateWhatsappNumber})`;
}
