import { useEffect } from "react";
import { useMeltoraFlux } from "./flux/meltoraFlux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideDrawer from "./components/SideDrawer";
import QuickOrderSheet from "./components/QuickOrderSheet";
import OrdersModal from "./components/OrdersModal";
import StudioModal from "./components/StudioModal";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ScanPage from "./pages/ScanPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import "./style/meltora.css";

function ActivePage({ state, actions }) {
  switch (state.currentPage) {
    case "explore":
      return <ExplorePage state={state} actions={actions} />;
    case "product":
      return <ProductDetailPage state={state} actions={actions} />;
    case "scan":
      return <ScanPage state={state} actions={actions} />;
    case "home":
    default:
      return <HomePage state={state} actions={actions} />;
  }
}

export default function App() {
  const { state, actions } = useMeltoraFlux();
  const { loadHomeData, verifyAdminSession } = actions;

  useEffect(() => {
    loadHomeData();
    verifyAdminSession();
  }, [loadHomeData, verifyAdminSession]);

  useEffect(() => {
    document.title = state.isAdmin
      ? "MeltOra - Admin"
      : "Meltora - Taste the Purity";
  }, [state.isAdmin]);

  const showAdminGate = state.isAdmin && !state.adminAuthenticated;

  const hasOverlayOpen =
    state.isDrawerOpen ||
    state.isOrderSheetOpen ||
    (state.isAdmin &&
      state.adminAuthenticated &&
      (state.isOrdersModalOpen || state.isCustomizerOpen));

  return (
    <>
      {state.toastMessage && (
        <div className="toast-banner">{state.toastMessage}</div>
      )}

      {showAdminGate ? (
        <main className="app-container">
          <AdminLoginPage state={state} actions={actions} />
        </main>
      ) : (
        <>
          <div
            className={`overlay-backdrop ${hasOverlayOpen ? "show" : ""}`}
            onClick={actions.closeOverlays}
          />

          <SideDrawer state={state} actions={actions} />
          <QuickOrderSheet state={state} actions={actions} />
          {state.isAdmin && state.adminAuthenticated && (
            <OrdersModal state={state} actions={actions} />
          )}
          {state.isAdmin && state.adminAuthenticated && (
            <StudioModal state={state} actions={actions} />
          )}

          {state.isAdmin && state.adminAuthenticated && state.backendError && (
            <div className="backend-alert-bar">
              <span>⚠️ {state.backendError}</span>
              <button onClick={actions.loadHomeData}>Retry</button>
            </div>
          )}

          <main className="app-container">
            <Header state={state} actions={actions} />
            <ActivePage state={state} actions={actions} />
            <Footer state={state} actions={actions} />
          </main>
        </>
      )}
    </>
  );
}
