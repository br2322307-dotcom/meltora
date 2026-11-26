import { useState } from "react";

function StudioModalContent({ state, actions }) {
  const [newCategory, setNewCategory] = useState(
    state.customizerDefaultCategory || "chocolate"
  );
  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState(120);
  const [newImageUrl, setNewImageUrl] = useState("");

  const initialSlide = state.heroSlides[0] || {};
  const [editingSlideIdx, setEditingSlideIdx] = useState(0);
  const [heroTitleWhite, setHeroTitleWhite] = useState(initialSlide.titleWhite || "");
  const [heroTitleGold, setHeroTitleGold] = useState(initialSlide.titleGold || "");
  const [heroLine1, setHeroLine1] = useState(initialSlide.line1 || "");
  const [heroLine2, setHeroLine2] = useState(initialSlide.line2 || "");
  const [heroCustomImg, setHeroCustomImg] = useState(initialSlide.customImageUrl || "");

  const [chocoWa, setChocoWa] = useState(state.chocolateWhatsappNumber);
  const [gheeWa, setGheeWa] = useState(state.gheeWhatsappNumber);
  const [routingMode, setRoutingMode] = useState(state.whatsappRoutingMode);
  const [groupLink, setGroupLink] = useState(state.whatsappGroupLink);
  const [callNum, setCallNum] = useState(state.callNumber);
  const [callDisp, setCallDisp] = useState(state.callDisplay);

  const handleSelectSlide = (idx) => {
    setEditingSlideIdx(idx);
    const s = state.heroSlides[idx] || {};
    setHeroTitleWhite(s.titleWhite || "");
    setHeroTitleGold(s.titleGold || "");
    setHeroLine1(s.line1 || "");
    setHeroLine2(s.line2 || "");
    setHeroCustomImg(s.customImageUrl || "");
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    const l1 = newLine1.trim() || "Meltora";
    const l2 = newLine2.trim() || (newCategory === "ghee" ? "Desi Ghee" : "Chocolate");
    const full = newFullName.trim() || `${l1} ${l2}`;
    const priceVal = parseInt(newPrice, 10) || (newCategory === "ghee" ? 650 : 100);

    const ok = await actions.addProduct({
      category: newCategory,
      line1: l1,
      line2: l2,
      fullName: full,
      weight: newWeight.trim(),
      description: newDescription.trim(),
      price: priceVal,
      imageUrl: newImageUrl.trim(),
    });

    if (ok) {
      setNewLine1("");
      setNewLine2("");
      setNewFullName("");
      setNewWeight("");
      setNewDescription("");
      setNewImageUrl("");
      actions.closeCustomizer();
    }
  };

  const handleHeroSlideSave = (e) => {
    e.preventDefault();
    actions.updateHeroSlide(editingSlideIdx, {
      titleWhite: heroTitleWhite.trim(),
      titleGold: heroTitleGold.trim(),
      line1: heroLine1.trim(),
      line2: heroLine2.trim(),
      customImageUrl: heroCustomImg.trim(),
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await actions.saveStoreSettings({
      chocolateWhatsappNumber: chocoWa.trim(),
      gheeWhatsappNumber: gheeWa.trim(),
      whatsappRoutingMode: routingMode,
      whatsappGroupLink: groupLink.trim(),
      callNumber: callNum.trim(),
      callDisplay: callDisp.trim() || callNum.trim(),
    });
    actions.closeCustomizer();
  };

  return (
    <div className="customizer-modal-dialog">
      <div className="customizer-header">
        <div>
          <h3>⚙️ MeltOra Studio</h3>
          <p className="customizer-sub">Products, Banners &amp; WhatsApp Routing</p>
        </div>
        <button
          className="close-x"
          onClick={actions.closeCustomizer}
          aria-label="Close Customizer"
        >
          &times;
        </button>
      </div>

      <div className="customizer-tabs">
        <button
          className={`c-tab-btn ${state.customizerTab === "addProduct" ? "active" : ""}`}
          onClick={() => actions.setCustomizerTab("addProduct")}
        >
          ➕ Add
        </button>
        <button
          className={`c-tab-btn ${state.customizerTab === "whatsappSettings" ? "active" : ""}`}
          onClick={() => actions.setCustomizerTab("whatsappSettings")}
        >
          💬 WhatsApp
        </button>
        <button
          className={`c-tab-btn ${state.customizerTab === "heroBanner" ? "active" : ""}`}
          onClick={() => actions.setCustomizerTab("heroBanner")}
        >
          🎬 Banner
        </button>
        <button
          className={`c-tab-btn ${state.customizerTab === "manageProducts" ? "active" : ""}`}
          onClick={() => actions.setCustomizerTab("manageProducts")}
        >
          📦 Items
        </button>
      </div>

      <div className="customizer-body">
        {state.customizerTab === "addProduct" && (
          <form onSubmit={handleAddProductSubmit} className="c-form">
            <div className="c-field">
              <label className="c-label">Select Category</label>
              <div className="cat-toggle-row">
                <button
                  type="button"
                  className={`cat-toggle-btn ${newCategory === "chocolate" ? "active-choco" : ""}`}
                  onClick={() => setNewCategory("chocolate")}
                >
                  🍫 Chocolate
                </button>
                <button
                  type="button"
                  className={`cat-toggle-btn ${newCategory === "ghee" ? "active-ghee" : ""}`}
                  onClick={() => setNewCategory("ghee")}
                >
                  🍯 Desi Ghee
                </button>
              </div>
            </div>

            <div className="c-field-row">
              <div className="c-field">
                <label className="c-label">Brand / Line 1</label>
                <input
                  type="text"
                  placeholder={newCategory === "chocolate" ? "e.g. Ferrero" : "e.g. Gir Organic"}
                  value={newLine1}
                  onChange={(e) => setNewLine1(e.target.value)}
                  className="c-input"
                  required
                />
              </div>
              <div className="c-field">
                <label className="c-label">Variant / Line 2</label>
                <input
                  type="text"
                  placeholder={newCategory === "chocolate" ? "e.g. Rocher Gold" : "e.g. A2 Cow Ghee"}
                  value={newLine2}
                  onChange={(e) => setNewLine2(e.target.value)}
                  className="c-input"
                  required
                />
              </div>
            </div>

            <div className="c-field-row">
              <div className="c-field" style={{ flex: 2 }}>
                <label className="c-label">Pack Size / Weight</label>
                <input
                  type="text"
                  placeholder={newCategory === "chocolate" ? "e.g. 150g Box" : "e.g. 500ml Jar"}
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="c-input"
                />
              </div>
              <div className="c-field" style={{ flex: 1 }}>
                <label className="c-label">Price (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="c-input"
                  required
                />
              </div>
            </div>

            <div className="c-field">
              <label className="c-label">Product Description</label>
              <input
                type="text"
                placeholder="Short taste, purity & origin highlights..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="c-input"
              />
            </div>

            <div className="c-field">
              <label className="c-label">Full Product Name (Optional)</label>
              <input
                type="text"
                placeholder="Auto-combined if left blank"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="c-input"
              />
            </div>

            <div className="c-field">
              <label className="c-label">Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="c-input"
              />
            </div>

            <button type="submit" className="c-submit-btn">
              💾 Save Product to MongoDB
            </button>
          </form>
        )}

        {state.customizerTab === "whatsappSettings" && (
          <form onSubmit={handleSaveSettings} className="c-form">
            <div className="c-field">
              <label className="c-label">WhatsApp Redirect Strategy</label>
              <div className="cat-toggle-row">
                <button
                  type="button"
                  className={`cat-toggle-btn ${routingMode === "category" ? "active-choco" : ""}`}
                  onClick={() => setRoutingMode("category")}
                >
                  📱 Separate Numbers
                </button>
                <button
                  type="button"
                  className={`cat-toggle-btn ${routingMode === "group" ? "active-ghee" : ""}`}
                  onClick={() => setRoutingMode("group")}
                >
                  👥 Combined Group
                </button>
              </div>
            </div>

            <div className="c-field">
              <label className="c-label">🍫 Chocolate WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={chocoWa}
                onChange={(e) => setChocoWa(e.target.value)}
                placeholder="919876543210"
                className="c-input"
              />
            </div>

            <div className="c-field">
              <label className="c-label">🍯 Desi Ghee WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={gheeWa}
                onChange={(e) => setGheeWa(e.target.value)}
                placeholder="919876543211"
                className="c-input"
              />
            </div>

            <div className="c-field">
              <label className="c-label">👥 Combined WhatsApp Group Invite Link</label>
              <input
                type="url"
                value={groupLink}
                onChange={(e) => setGroupLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="c-input"
              />
            </div>

            <div className="c-field-row">
              <div className="c-field">
                <label className="c-label">📞 Direct Call Number</label>
                <input
                  type="text"
                  value={callNum}
                  onChange={(e) => setCallNum(e.target.value)}
                  placeholder="+919876543210"
                  className="c-input"
                />
              </div>
              <div className="c-field">
                <label className="c-label">Display Label</label>
                <input
                  type="text"
                  value={callDisp}
                  onChange={(e) => setCallDisp(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="c-input"
                />
              </div>
            </div>

            <button type="submit" className="c-submit-btn">
              💾 Save WhatsApp &amp; Call Settings
            </button>
          </form>
        )}

        {state.customizerTab === "heroBanner" && (
          <div className="c-hero-config">
            <div className="c-field">
              <label className="c-label">Transition Animation Effect</label>
              <div className="anim-choice-grid">
                {[
                  { id: "slide", label: "↔️ Slide", desc: "Smooth carousel" },
                  { id: "fade", label: "✨ Fade", desc: "Cross-dissolve" },
                  { id: "zoom", label: "🔍 Zoom", desc: "Cinematic zoom" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`anim-choice-card ${state.heroAnimation === item.id ? "active" : ""}`}
                    onClick={() => actions.setHeroAnimation(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="c-field" style={{ marginTop: 14 }}>
              <label className="c-label">Select Banner Slide to Edit</label>
              <div className="slide-selector-row">
                {state.heroSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`slide-select-btn ${editingSlideIdx === idx ? "active" : ""}`}
                    onClick={() => handleSelectSlide(idx)}
                  >
                    Slide {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleHeroSlideSave} className="c-form" style={{ marginTop: 10 }}>
              <div className="c-field-row">
                <div className="c-field">
                  <label className="c-label">Title (White)</label>
                  <input
                    type="text"
                    value={heroTitleWhite}
                    onChange={(e) => setHeroTitleWhite(e.target.value)}
                    className="c-input"
                  />
                </div>
                <div className="c-field">
                  <label className="c-label">Title (Gold)</label>
                  <input
                    type="text"
                    value={heroTitleGold}
                    onChange={(e) => setHeroTitleGold(e.target.value)}
                    className="c-input"
                  />
                </div>
              </div>

              <div className="c-field-row">
                <div className="c-field">
                  <label className="c-label">Subtitle Line 1</label>
                  <input
                    type="text"
                    value={heroLine1}
                    onChange={(e) => setHeroLine1(e.target.value)}
                    className="c-input"
                  />
                </div>
                <div className="c-field">
                  <label className="c-label">Subtitle Line 2</label>
                  <input
                    type="text"
                    value={heroLine2}
                    onChange={(e) => setHeroLine2(e.target.value)}
                    className="c-input"
                  />
                </div>
              </div>

              <div className="c-field">
                <label className="c-label">Custom Slide Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={heroCustomImg}
                  onChange={(e) => setHeroCustomImg(e.target.value)}
                  className="c-input"
                />
              </div>

              <button type="submit" className="c-submit-btn">
                💾 Save Slide {editingSlideIdx + 1}
              </button>
            </form>
          </div>
        )}

        {state.customizerTab === "manageProducts" && (
          <div className="c-manage-list">
            <h5 className="c-sec-title">🍫 Chocolates ({state.chocolates.length})</h5>
            <div className="manage-items-grid">
              {state.chocolates.map((item) => (
                <div key={item.id} className="manage-item-row">
                  <div className="manage-item-info">
                    <strong>{item.fullName || item.full_name}</strong>
                    <span>₹{item.price} • {item.id}</span>
                  </div>
                  <button
                    type="button"
                    className="manage-del-btn"
                    onClick={() => actions.deleteProduct(item.id, "chocolate")}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>

            <h5 className="c-sec-title" style={{ marginTop: 16 }}>
              🍯 Desi Ghee ({state.ghees.length})
            </h5>
            <div className="manage-items-grid">
              {state.ghees.map((item) => (
                <div key={item.id} className="manage-item-row">
                  <div className="manage-item-info">
                    <strong>{item.fullName || item.full_name}</strong>
                    <span>₹{item.price} • {item.id}</span>
                  </div>
                  <button
                    type="button"
                    className="manage-del-btn"
                    onClick={() => actions.deleteProduct(item.id, "ghee")}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudioModal({ state, actions }) {
  if (!state.isCustomizerOpen) return null;
  return (
    <StudioModalContent
      key={state.customizerDefaultCategory}
      state={state}
      actions={actions}
    />
  );
}
