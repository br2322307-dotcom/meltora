export default function QuickOrderSheet({ state, actions }) {
  return (
    <div className={`bottom-sheet ${state.isOrderSheetOpen ? "open" : ""}`}>
      <div className="sheet-header">
        <div className="sheet-handle" />
        <button
          className="sheet-close-btn"
          onClick={actions.closeOverlays}
          aria-label="Close quick connect sheet"
        >
          &times;
        </button>
      </div>

      <h4 className="sheet-title">
        {state.selectedProduct
          ? state.selectedProduct
          : "Connect with MeltOra on WhatsApp"}
      </h4>
      <p className="sheet-desc">
        No login required. Choose the department you want to explore or order from and chat directly on WhatsApp or call us.
      </p>

      <div className="sheet-actions">
        <button
          type="button"
          className="sheet-btn-wa"
          onClick={() => {
            actions.redirectToWhatsApp({
              category: "chocolate",
              forceMode: "category",
            });
            actions.closeOverlays();
          }}
        >
          <span>🍫 Chocolate WhatsApp Desk</span>
        </button>

        <button
          type="button"
          className="sheet-btn-wa sheet-btn-ghee"
          onClick={() => {
            actions.redirectToWhatsApp({
              category: "ghee",
              forceMode: "category",
            });
            actions.closeOverlays();
          }}
        >
          <span>🍯 Desi Ghee WhatsApp Desk</span>
        </button>

        <button
          type="button"
          className="sheet-btn-group"
          onClick={() => {
            actions.redirectToWhatsApp({ forceMode: "group" });
            actions.closeOverlays();
          }}
        >
          <span>👥 Join MeltOra Combined WhatsApp Group</span>
        </button>

        <a href={`tel:${state.callNumber}`} className="sheet-btn-call">
          <span>📞 Call Directly ({state.callDisplay})</span>
        </a>
      </div>
    </div>
  );
}
