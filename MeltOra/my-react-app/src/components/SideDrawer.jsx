export default function SideDrawer({ state, actions }) {
  return (
    <aside className={`side-drawer ${state.isDrawerOpen ? "open" : ""}`}>
      <div className="drawer-top">
        <div className="drawer-brand">
          <span className="drawer-logo">
            {state.isAdmin ? "MeltOra - Admin" : "Meltora"}
          </span>
          <span className="drawer-tag">
            {state.isAdmin ? "Store Management" : "Taste the Purity"}
          </span>
        </div>
        <button
          className="close-x"
          onClick={actions.closeOverlays}
          aria-label="Close Menu"
        >
          &times;
        </button>
      </div>

      {state.isAdmin && (
        <div className="drawer-db-status">
          <span className={`status-dot ${state.backendConnected ? "online" : "offline"}`} />
          <span>
            {state.backendConnected
              ? "Backend & MongoDB Connected"
              : "Offline Mode (Local Catalog)"}
          </span>
        </div>
      )}

      <ul className="drawer-links">
        <li>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              actions.navigateTo("home");
            }}
          >
            <span>🏠</span> Home
          </a>
        </li>
        <li>
          <a
            href="#explore"
            onClick={(e) => {
              e.preventDefault();
              actions.navigateTo("explore", { category: "all" });
            }}
          >
            <span>✨</span> Explore All Products
          </a>
        </li>
        <li>
          <a
            href="#explore-chocolate"
            onClick={(e) => {
              e.preventDefault();
              actions.navigateTo("explore", { category: "chocolate" });
            }}
          >
            <span>🍫</span> Chocolate Collection
          </a>
        </li>
        <li>
          <a
            href="#explore-ghee"
            onClick={(e) => {
              e.preventDefault();
              actions.navigateTo("explore", { category: "ghee" });
            }}
          >
            <span>🍯</span> Desi Ghee Collection
          </a>
        </li>
        <li>
          <a
            href="#scan"
            onClick={(e) => {
              e.preventDefault();
              actions.navigateTo("scan");
            }}
          >
            <span>📷</span> {state.isAdmin ? "Website & Pack QR Hub" : "Website QR Code"}
          </a>
        </li>

        {state.isAdmin && (
          <>
            <li>
              <a
                href="#studio"
                onClick={(e) => {
                  e.preventDefault();
                  actions.openCustomizer("whatsappSettings");
                }}
              >
                <span>⚙️</span> Studio &amp; WhatsApp Settings
              </a>
            </li>
            <li>
              <a
                href="#orders"
                onClick={(e) => {
                  e.preventDefault();
                  actions.openOrdersModal();
                }}
              >
                <span>📋</span> Saved Orders (MongoDB)
              </a>
            </li>
            <li>
              <a href="/">
                <span>🌐</span> Open Customer Website (/)
              </a>
            </li>
          </>
        )}

        <li>
          <a
            href="#whatsapp"
            onClick={(e) => {
              e.preventDefault();
              actions.openOrderSheet(null);
            }}
          >
            <span>💬</span> Chat on WhatsApp
          </a>
        </li>
        <li>
          <a href={`tel:${state.callNumber}`}>
            <span>📞</span> Call Direct ({state.callDisplay})
          </a>
        </li>
      </ul>
    </aside>
  );
}
