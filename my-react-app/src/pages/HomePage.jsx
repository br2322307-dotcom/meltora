import { useEffect } from "react";
import { HeroSlideArtwork } from "../components/ProductArtwork";
import ProductCard from "../components/ProductCard";

export default function HomePage({ state, actions }) {
  const currentSlide = state.heroSlides[state.activeSlide] || state.heroSlides[0];

  useEffect(() => {
    if (!state.isHeroAutoPlay) return;
    const interval = setInterval(() => {
      actions.nextHeroSlide();
    }, state.heroAutoPlaySpeed || 4500);
    return () => clearInterval(interval);
  }, [state.isHeroAutoPlay, state.heroAutoPlaySpeed, actions]);

  return (
    <>
      {/* 1. DYNAMIC ANIMATED HERO BANNER */}
      <section className="hero-wrap">
        <div className="hero-banner-outer">
          <div
            className={`hero-banner hero-anim-${state.heroAnimation}`}
            key={state.activeSlide}
          >
            <HeroSlideArtwork slide={currentSlide} />

            <div className="hero-text-box">
              <div className="hero-badge-tag">
                {currentSlide.theme === "ghee"
                  ? "🍯 100% Pure Desi Ghee"
                  : currentSlide.theme === "combo"
                  ? "✨ Scan & Explore"
                  : "🍫 Handcrafted Chocolate"}
              </div>
              <div className="hero-logo-text">{currentSlide.brand}</div>
              <div className="hero-headline">
                {currentSlide.titleWhite}{" "}
                <span className="gold">{currentSlide.titleGold}</span>
              </div>
              <p className="hero-subtext">
                {currentSlide.line1}
                <br />
                {currentSlide.line2}
              </p>
            </div>

            <button
              className="hero-nav-btn prev"
              onClick={actions.prevHeroSlide}
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button
              className="hero-nav-btn next"
              onClick={actions.nextHeroSlide}
              aria-label="Next Slide"
            >
              ›
            </button>

            <div className="hero-dots">
              {state.heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  className={`hero-dot ${state.activeSlide === idx ? "active" : ""}`}
                  onClick={() => actions.selectHeroSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Admin-only Hero Animation & Customize Controls */}
          {state.isAdmin && (
            <div className="hero-controls-bar">
              <div className="anim-selector-group">
                <span className="anim-label">Animation:</span>
                {["slide", "fade", "zoom"].map((anim) => (
                  <button
                    key={anim}
                    className={`anim-pill ${state.heroAnimation === anim ? "active" : ""}`}
                    onClick={() => actions.setHeroAnimation(anim)}
                  >
                    {anim.charAt(0).toUpperCase() + anim.slice(1)}
                  </button>
                ))}
                <button
                  className="anim-pill-toggle"
                  onClick={actions.toggleHeroAutoPlay}
                  title={state.isHeroAutoPlay ? "Pause Auto-Slide" : "Start Auto-Slide"}
                >
                  {state.isHeroAutoPlay ? "⏸️" : "▶️"}
                </button>
              </div>
              <button
                className="hero-customize-btn"
                onClick={() => actions.openCustomizer("heroBanner")}
              >
                ✏️ Customize
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY EXPLORER CARDS */}
      <section className="category-grid">
        <button
          type="button"
          className="cat-card cat-card-choco"
          onClick={() => actions.navigateTo("explore", { category: "chocolate" })}
        >
          <div className="cat-visual">
            <svg viewBox="0 0 64 56" width="50" height="46">
              <g transform="rotate(-14 32 28)">
                <rect x="6" y="12" width="46" height="28" rx="3" fill="#6E2E12" stroke="#9B4A24" strokeWidth="1" />
                <rect x="10" y="15" width="11" height="10" rx="1.5" fill="#4E1E0A" stroke="#853C1B" strokeWidth="0.8" />
                <rect x="23" y="15" width="11" height="10" rx="1.5" fill="#4E1E0A" stroke="#853C1B" strokeWidth="0.8" />
                <rect x="36" y="15" width="11" height="10" rx="1.5" fill="#4E1E0A" stroke="#853C1B" strokeWidth="0.8" />
                <rect x="10" y="27" width="11" height="10" rx="1.5" fill="#4E1E0A" stroke="#853C1B" strokeWidth="0.8" />
                <rect x="23" y="27" width="11" height="10" rx="1.5" fill="#4E1E0A" stroke="#853C1B" strokeWidth="0.8" />
                <rect x="36" y="27" width="11" height="10" rx="1.5" fill="#4E1E0A" stroke="#853C1B" strokeWidth="0.8" />
              </g>
              <g transform="translate(8, 12) rotate(8 24 20)">
                <rect x="8" y="18" width="38" height="20" rx="2.5" fill="#5A230C" stroke="#9E4D26" strokeWidth="1" />
                <line x1="20" y1="18" x2="20" y2="38" stroke="#361304" strokeWidth="1.5" />
                <line x1="33" y1="18" x2="33" y2="38" stroke="#361304" strokeWidth="1.5" />
                <line x1="8" y1="28" x2="46" y2="28" stroke="#361304" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
          <div className="cat-copy">
            <h3>Chocolate</h3>
            <p>Explore Rich Taste</p>
          </div>
          <div className="cat-circle-arrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#461b08" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          type="button"
          className="cat-card cat-card-ghee"
          onClick={() => actions.navigateTo("explore", { category: "ghee" })}
        >
          <div className="cat-visual">
            <svg viewBox="0 0 64 58" width="50" height="46">
              <path d="M36 24 L54 4 L58 7 L40 27 Z" fill="#A85520" />
              <ellipse cx="30" cy="38" rx="19" ry="15" fill="#C95A24" />
              <path d="M11 38 C11 49 49 49 49 38 C49 44 41 53 30 53 C19 53 11 44 11 38 Z" fill="#9E3F12" />
              <ellipse cx="30" cy="25" rx="15" ry="5" fill="#B54B19" stroke="#85320C" strokeWidth="1" />
              <ellipse cx="30" cy="25" rx="12.5" ry="3.8" fill="#FFE63B" />
              <ellipse cx="28" cy="25" rx="7" ry="2" fill="#FFF799" />
            </svg>
          </div>
          <div className="cat-copy">
            <h3>দেশি ঘি</h3>
            <p>শুদ্ধতার আসল স্বাদ</p>
          </div>
          <div className="cat-circle-arrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#461b08" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </section>

      {/* 3. OUR CHOCOLATE COLLECTION */}
      <div id="chocolate-section" className="section-divider">
        <span className="rule" />
        <h2 className="section-heading">
          <span>🍫 Our Chocolate Collection</span>
        </h2>
        <span className="rule right" />
      </div>

      <section className="products-row">
        {state.chocolates.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onSelect={(p) => actions.openProductDetail(p)}
          />
        ))}
        {state.isAdmin && (
          <div
            className="item-card item-card-add"
            onClick={() => actions.openCustomizer("addProduct", "chocolate")}
            title="Add Custom Chocolate"
          >
            <div className="item-add-icon choco">+</div>
            <div className="item-add-text">Add Chocolate</div>
          </div>
        )}
      </section>

      {/* 4. OUR DESI GHEE COLLECTION */}
      <div id="ghee-section" className="section-divider">
        <span className="rule" />
        <h2 className="section-heading">
          <span>
            🍯 Our <span className="highlight">Desi Ghee</span> Collection
          </span>
        </h2>
        <span className="rule right" />
      </div>

      <section className="products-row">
        {state.ghees.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onSelect={(p) => actions.openProductDetail(p)}
          />
        ))}
        {state.isAdmin && (
          <div
            className="item-card item-card-add"
            onClick={() => actions.openCustomizer("addProduct", "ghee")}
            title="Add Custom Desi Ghee"
          >
            <div className="item-add-icon ghee">+</div>
            <div className="item-add-text">Add Desi Ghee</div>
          </div>
        )}
      </section>

      {/* 5. BRAND QR & WHATSAPP DISCOVERY BANNER */}
      <section id="qr-whatsapp-box" className="wa-order-banner">
        <svg className="wa-qr-art" viewBox="0 0 76 74">
          <path d="M18 46 C4 42 2 28 12 24 C18 30 20 38 18 46 Z" fill="#23B83E" />
          <path d="M16 54 C2 55 1 44 10 40 C15 44 17 49 16 54 Z" fill="#6BD425" />
          <path d="M58 34 C70 28 73 16 64 13 C58 19 56 26 58 34 Z" fill="#D99B26" opacity="0.85" />
          <path d="M14 58 Q36 68 62 56 Q52 70 24 68 Z" fill="#F8CA49" />
          <g transform="rotate(-14 38 37)">
            <rect x="20" y="6" width="36" height="60" rx="6" fill="#241B18" stroke="#4A3832" strokeWidth="1.2" />
            <rect x="23" y="11" width="30" height="50" rx="3" fill="#FFFFFF" />
            <path d="M26 22 V18 H30 M46 18 H50 V22 M50 44 V48 H46 M30 48 H26 V44" fill="none" stroke="#F5B81C" strokeWidth="2" strokeLinecap="round" />
            <rect x="29" y="21" width="7" height="7" fill="#222" />
            <rect x="31" y="23" width="3" height="3" fill="#FFF" />
            <rect x="40" y="21" width="7" height="7" fill="#222" />
            <rect x="42" y="23" width="3" height="3" fill="#FFF" />
            <rect x="29" y="34" width="7" height="7" fill="#222" />
            <rect x="31" y="36" width="3" height="3" fill="#FFF" />
          </g>
        </svg>

        <div className="wa-banner-copy">
          <h4>
            Scan Pack. Explore Brand. <span className="wa-green">Chat on WhatsApp!</span>
          </h4>
          <p>
            No login needed. Explore MeltOra Chocolates &amp; Pure Desi Ghee, view details, and connect directly on WhatsApp or Call.
          </p>
        </div>

        <div className="wa-cta-dual">
          <button
            type="button"
            className="wa-pill-btn"
            onClick={() => actions.openOrderSheet(null)}
          >
            <div className="wa-pill-labels">
              <strong>Chat on WhatsApp</strong>
              <span>Chocolate • Ghee • Group</span>
            </div>
          </button>
          <button
            type="button"
            className="scan-hub-btn"
            onClick={() => actions.navigateTo("scan")}
          >
            📷 Website QR Code
          </button>
        </div>
      </section>
    </>
  );
}
