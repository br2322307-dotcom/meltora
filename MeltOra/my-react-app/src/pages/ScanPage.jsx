import { useState } from "react";
import QRCodeBox from "../components/QRCodeBox";
import { ProductVisual } from "../components/ProductArtwork";
import { getHomeWebsiteUrl, getProductScanUrl } from "../utils/qr";

export default function ScanPage({ state, actions }) {
  const allProducts = [
    ...state.chocolates.map((p) => ({ ...p, category: "chocolate" })),
    ...state.ghees.map((p) => ({ ...p, category: "ghee" })),
  ];

  const [selectedId, setSelectedId] = useState(allProducts[0]?.id || "cadbury");
  const selectedProduct =
    allProducts.find((p) => p.id === selectedId) || allProducts[0];
  const websiteHomeUrl = getHomeWebsiteUrl();

  return (
    <div className="page-section scan-page">
      <div className="page-top-bar">
        <button
          type="button"
          className="back-pill-btn"
          onClick={() => actions.navigateTo("home")}
        >
          ← Home
        </button>
        <span className="page-badge">
          {state.isAdmin ? "Website & Pack QR Hub" : "Official Brand QR"}
        </span>
      </div>

      {/* Primary Official Website QR Code -> Opens Home Page (/) */}
      <div className="scan-hero-box">
        <h2>📷 MeltOra Official Website QR</h2>
        <p>
          Scan this QR code with any phone camera to open the <strong>MeltOra Home Page</strong> directly — explore Chocolates &amp; Pure Desi Ghee, view details, and chat on WhatsApp with zero login.
        </p>

        <div className="website-qr-wrap">
          <QRCodeBox
            value={websiteHomeUrl}
            title="MeltOra-Official-Website"
            size={184}
          />
          <div className="qr-target-pill">Opens: {websiteHomeUrl}</div>
        </div>

        <div className="scan-quick-explore">
          <button
            type="button"
            className="desk-btn choco"
            onClick={() => actions.navigateTo("explore", { category: "chocolate" })}
          >
            🍫 Explore Chocolates
          </button>
          <button
            type="button"
            className="desk-btn ghee"
            onClick={() => actions.navigateTo("explore", { category: "ghee" })}
          >
            🍯 Explore Desi Ghee
          </button>
        </div>
      </div>

      {/* Admin-only Optional Per-Product Packaging QR Generator */}
      {state.isAdmin && (
        <div className="scan-generator-card">
          <h3>🏷️ Product-Specific Pack QRs (Admin Tool)</h3>
          <p className="scan-gen-sub">
            Generate or download individual product QR stickers if you want a box/jar scan to highlight a specific item:
          </p>

          <div className="scan-product-chips">
            {allProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`scan-chip ${selectedId === p.id ? "active" : ""}`}
                onClick={() => setSelectedId(p.id)}
              >
                {p.category === "ghee" ? "🍯" : "🍫"} {p.fullName || p.full_name}
              </button>
            ))}
          </div>

          {selectedProduct && (
            <div className="scan-selected-preview">
              <div className="scan-prod-mini">
                <div className="scan-prod-art">
                  <ProductVisual item={selectedProduct} />
                </div>
                <div>
                  <strong>{selectedProduct.fullName || selectedProduct.full_name}</strong>
                  <span>
                    ₹{selectedProduct.price} • {selectedProduct.weight || selectedProduct.category}
                  </span>
                </div>
              </div>

              <QRCodeBox
                value={getProductScanUrl(selectedProduct.id)}
                title={selectedProduct.fullName || selectedProduct.full_name}
                size={150}
              />

              <button
                type="button"
                className="c-submit-btn"
                onClick={() => actions.openProductDetail(selectedProduct.id, { fromScan: true })}
              >
                🚀 Preview Customer Product View
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
