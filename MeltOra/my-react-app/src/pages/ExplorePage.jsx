import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ExplorePage({ state, actions }) {
  const [search, setSearch] = useState("");
  const activeCat = state.exploreCategory || "all";

  const allProducts = [
    ...state.chocolates.map((p) => ({ ...p, category: "chocolate" })),
    ...state.ghees.map((p) => ({ ...p, category: "ghee" })),
  ];

  const filtered = allProducts.filter((item) => {
    const matchesCat = activeCat === "all" || item.category === activeCat;
    const q = search.trim().toLowerCase();
    if (!q) return matchesCat;
    const text = `${item.fullName || item.full_name} ${item.line1} ${item.line2} ${item.description || ""}`.toLowerCase();
    return matchesCat && text.includes(q);
  });

  return (
    <div className="page-section explore-page">
      <div className="page-top-bar">
        <button
          type="button"
          className="back-pill-btn"
          onClick={() => actions.navigateTo("home")}
        >
          ← Home
        </button>
        <span className="page-badge">Brand Explorer</span>
      </div>

      <div className="explore-hero-card">
        <h2>Explore MeltOra Purity</h2>
        <p>
          Discover handcrafted chocolates and pure Bilona desi ghee. Tap any item for full details, direct call, or instant WhatsApp chat — no login needed.
        </p>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chocolates, desi ghee, brands..."
          className="explore-search-input"
        />

        <div className="explore-filter-tabs">
          {[
            { id: "all", label: `All (${allProducts.length})` },
            { id: "chocolate", label: `🍫 Chocolates (${state.chocolates.length})` },
            { id: "ghee", label: `🍯 Desi Ghee (${state.ghees.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`explore-tab-btn ${activeCat === tab.id ? "active" : ""}`}
              onClick={() => actions.setExploreCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-orders-state">
          <p>No matching products found.</p>
          <span>Try clearing your search or switching category.</span>
        </div>
      ) : (
        <div className="explore-grid">
          {filtered.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              className="explore-grid-card"
              onSelect={(p) => actions.openProductDetail(p)}
            />
          ))}
        </div>
      )}

      <div className="explore-direct-desk">
        <h4>Want recommendations or bulk rates?</h4>
        <div className="explore-desk-btns">
          <button
            type="button"
            className="desk-btn choco"
            onClick={() => actions.redirectToWhatsApp({ category: "chocolate" })}
          >
            💬 Chocolate WhatsApp
          </button>
          <button
            type="button"
            className="desk-btn ghee"
            onClick={() => actions.redirectToWhatsApp({ category: "ghee" })}
          >
            💬 Desi Ghee WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
