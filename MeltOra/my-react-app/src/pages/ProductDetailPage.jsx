import { useState } from "react";
import { ProductVisual } from "../components/ProductArtwork";
import ProductCard from "../components/ProductCard";
import QRCodeBox from "../components/QRCodeBox";
import { getProductScanUrl } from "../utils/qr";
import { getWhatsAppDeskLabel } from "../utils/whatsapp";

export default function ProductDetailPage({ state, actions }) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [showQr, setShowQr] = useState(false);

  const allProducts = [
    ...state.chocolates.map((p) => ({ ...p, category: "chocolate" })),
    ...state.ghees.map((p) => ({ ...p, category: "ghee" })),
  ];

  const product =
    allProducts.find((p) => p.id === state.selectedProductId) || allProducts[0];

  if (!product) {
    return (
      <div className="page-section">
        <p>No product selected.</p>
        <button type="button" onClick={() => actions.navigateTo("home")}>
          Go Home
        </button>
      </div>
    );
  }

  const isScanned = state.scannedProductId === product.id;
  const isGhee = product.category === "ghee";

  // Same-category + cross-category discovery (core marketing strategy)
  const sameCategory = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const crossCategory = allProducts
    .filter((p) => p.category !== product.category)
    .slice(0, 4);

  const scanUrl = getProductScanUrl(product.id);
  const deskLabel = getWhatsAppDeskLabel(product.category, state);

  return (
    <div className="page-section product-detail-page">
      <div className="page-top-bar">
        <button
          type="button"
          className="back-pill-btn"
          onClick={() => actions.navigateTo("explore", { category: product.category })}
        >
          ← Back to {isGhee ? "Desi Ghee" : "Chocolates"}
        </button>
        <button
          type="button"
          className="back-pill-btn"
          onClick={() => actions.navigateTo("home")}
        >
          🏠 Home
        </button>
      </div>

      {isScanned && (
        <div className="scan-verified-banner">
          <span>✅ Verified MeltOra Product Scanned</span>
          <small>Explore details below or connect directly on WhatsApp</small>
        </div>
      )}

      {/* Main Product Detail Card */}
      <div className={`detail-hero-card ${isGhee ? "theme-ghee" : "theme-choco"}`}>
        <div className="detail-category-chip">
          {isGhee ? "🍯 Pure Desi Ghee" : "🍫 Artisanal Chocolate"}
        </div>

        <div className="detail-visual-box">
          <ProductVisual item={product} className="detail-custom-img" />
        </div>

        <h1 className="detail-title">{product.fullName || product.full_name}</h1>

        <div className="detail-meta-row">
          <span className="detail-price">₹{product.price}</span>
          {product.weight && <span className="detail-weight">{product.weight}</span>}
          <span className="detail-purity">100% Authentic</span>
        </div>

        <p className="detail-description">
          {product.description ||
            (isGhee
              ? "Traditional slow-churned pure cow desi ghee with rich golden aroma."
              : "Velvety handcrafted chocolate made with rich cocoa for pure indulgence.")}
        </p>

        <div className="detail-highlights">
          <span>✓ Zero Login Needed</span>
          <span>✓ Direct Brand Support</span>
          <span>✓ Instant WhatsApp Dispatch</span>
        </div>
      </div>

      {/* Zero-Login Direct WhatsApp & Call Box */}
      <div className="detail-action-panel">
        <div className="detail-qty-row">
          <div className="qty-label-wrap">
            <strong>Quantity</strong>
            <span>Total: ₹{(product.price || 0) * quantity}</span>
          </div>
          <div className="qty-picker-row">
            <button
              type="button"
              className="qty-step-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="detail-qty-val">{quantity}</span>
            <button
              type="button"
              className="qty-step-btn"
              onClick={() => setQuantity((q) => Math.min(50, q + 1))}
            >
              +
            </button>
          </div>
        </div>

        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Your Name (Optional — skip for instant WhatsApp)"
          className="sheet-input"
        />

        <button
          type="button"
          className="sheet-btn-wa detail-wa-primary"
          onClick={() =>
            actions.redirectToWhatsApp({
              product,
              quantity,
              customerName,
              fromScan: isScanned,
            })
          }
        >
          <span>💬 Order / Chat on WhatsApp</span>
          <small>{deskLabel}</small>
        </button>

        <div className="detail-secondary-actions">
          <a href={`tel:${state.callNumber}`} className="sheet-btn-call">
            📞 Call Direct
          </a>
          <button
            type="button"
            className="sheet-btn-call"
            onClick={() =>
              actions.redirectToWhatsApp({
                product,
                quantity,
                customerName,
                forceMode: "group",
                fromScan: isScanned,
              })
            }
          >
            👥 WhatsApp Group
          </button>
          <button
            type="button"
            className="sheet-btn-call"
            onClick={() => setShowQr((prev) => !prev)}
          >
            {showQr ? "✖ Hide QR" : "📷 Pack QR"}
          </button>
        </div>

        {showQr && (
          <div className="detail-qr-panel">
            <p className="detail-qr-hint">
              Print or scan this QR code to open <strong>{product.fullName || product.full_name}</strong> directly:
            </p>
            <QRCodeBox
              value={scanUrl}
              title={product.fullName || product.full_name}
              size={148}
            />
          </div>
        )}
      </div>

      {/* Related Same-Category Products */}
      {sameCategory.length > 0 && (
        <div className="detail-related-block">
          <div className="section-divider">
            <span className="rule" />
            <h2 className="section-heading">
              <span>More {isGhee ? "Desi Ghee" : "Chocolates"}</span>
            </h2>
            <span className="rule right" />
          </div>
          <div className="products-row">
            {sameCategory.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onSelect={(p) => actions.openProductDetail(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cross-Category Marketing Discovery */}
      {crossCategory.length > 0 && (
        <div className="detail-related-block">
          <div className="section-divider">
            <span className="rule" />
            <h2 className="section-heading">
              <span>Also Explore {isGhee ? "Chocolates 🍫" : "Desi Ghee 🍯"}</span>
            </h2>
            <span className="rule right" />
          </div>
          <div className="products-row">
            {crossCategory.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onSelect={(p) => actions.openProductDetail(p)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
