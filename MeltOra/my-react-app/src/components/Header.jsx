export default function Header({ state, actions }) {
  return (
    <>
      {state.isAdmin && state.adminAuthenticated && (
        <div className="admin-top-strip">
          <span>🛡️ MeltOra - Admin</span>
          <div className="admin-strip-actions">
            <a href="/" className="admin-preview-link">
              👁️ Site (/)
            </a>
            <button
              type="button"
              className="admin-logout-btn"
              onClick={actions.logoutAdmin}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      <header className="top-header">
        <button
          className="hamburger-btn"
          onClick={actions.openDrawer}
          aria-label="Open Navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className="brand-center"
          onClick={() => actions.navigateTo("home")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && actions.navigateTo("home")}
          style={{ cursor: "pointer" }}
        >
          <svg className="brand-leaves" viewBox="0 0 32 20" fill="none">
            <path d="M15 15C13 8 7 5 3 6C4 11 9 15 15 15Z" fill="#EAB543" />
            <path d="M16 14C19 7 25 3 30 4C28 10 22 14 16 14Z" fill="#F8CA49" />
          </svg>
          <div className="brand-name">Meltora</div>
          <div className="brand-tagline">
            <span className="line" />
            <span>{state.isAdmin ? "Admin Studio" : "Taste the Purity"}</span>
            <span className="line" />
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`header-tool-btn ${state.currentPage === "explore" ? "active" : ""}`}
            onClick={() => actions.navigateTo("explore", { category: "all" })}
            title="Explore all products"
          >
            <span>Explore</span>
          </button>

          {state.isAdmin && state.adminAuthenticated && (
            <>
              <button
                type="button"
                className="header-tool-btn"
                onClick={() => actions.openCustomizer("addProduct")}
                title="Customize Store & WhatsApp"
              >
                <span>⚙️ Studio</span>
              </button>
              <button
                type="button"
                className="header-orders-btn"
                onClick={actions.openOrdersModal}
                title="View & Manage Saved Orders"
              >
                <span className={`db-indicator ${state.backendConnected ? "live" : "offline"}`} />
                <span>Orders</span>
              </button>
            </>
          )}

          <button
            type="button"
            className="scan-pill-btn"
            onClick={() => actions.navigateTo("scan")}
            title="Official Website QR Code"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#220A02" strokeWidth="2.2">
              <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="4" height="4" fill="#220A02" stroke="none" />
              <rect x="13" y="7" width="4" height="4" fill="#220A02" stroke="none" />
              <rect x="7" y="13" width="4" height="4" fill="#220A02" stroke="none" />
              <rect x="13" y="13" width="4" height="4" fill="#220A02" stroke="none" />
            </svg>
            <span>QR</span>
          </button>
        </div>
      </header>
    </>
  );
}
