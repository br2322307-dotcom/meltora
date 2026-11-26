import { useState } from "react";

export default function OrdersModal({ state, actions }) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!state.isAdmin || !state.isOrdersModalOpen) return null;

  const handleClearAll = async () => {
    await actions.clearAllOrders();
    setConfirmClear(false);
  };

  return (
    <div className="orders-modal-dialog">
      <div className="orders-modal-header">
        <div>
          <h3>📋 Saved Orders (MeltOra - Admin)</h3>
          <p className="orders-sub">
            {state.savedOrders.length} record(s) in MongoDB collection <code>orders</code>
          </p>
        </div>
        <button
          className="close-x"
          onClick={actions.closeOrdersModal}
          aria-label="Close orders"
        >
          &times;
        </button>
      </div>

      <div className="orders-modal-body">
        {state.savedOrders.length === 0 ? (
          <div className="empty-orders-state">
            <p>No orders or inquiries saved yet.</p>
            <span>Customer WhatsApp taps will appear here automatically.</span>
          </div>
        ) : (
          <div className="orders-list">
            {state.savedOrders.map((ord) => (
              <div key={ord.id} className="order-record-card">
                <div className="ord-top">
                  <span className="ord-code">{ord.orderCode || ord.order_code}</span>
                  <div className="ord-top-right">
                    <span className="ord-date">{ord.createdAt || ord.created_at}</span>
                    <button
                      type="button"
                      className="ord-del-btn"
                      onClick={() => actions.deleteOrder(ord.id)}
                      title="Delete this order"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="ord-main">
                  <strong>{ord.productName || ord.product_name}</strong>
                  <span className="ord-qty">Qty: {ord.quantity}</span>
                </div>
                <div className="ord-customer">
                  👤 {ord.customerName || ord.customer_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="orders-modal-footer">
        <button type="button" className="refresh-btn" onClick={actions.loadSavedOrders}>
          🔄 Refresh
        </button>

        {state.savedOrders.length > 0 && (
          !confirmClear ? (
            <button
              type="button"
              className="clear-all-orders-btn"
              onClick={() => setConfirmClear(true)}
            >
              🗑️ Delete All
            </button>
          ) : (
            <div className="confirm-clear-wrap">
              <button
                type="button"
                className="clear-all-confirm-btn"
                onClick={handleClearAll}
              >
                Confirm Clear
              </button>
              <button
                type="button"
                className="refresh-btn"
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </button>
            </div>
          )
        )}

        <button type="button" className="close-modal-btn" onClick={actions.closeOrdersModal}>
          Done
        </button>
      </div>
    </div>
  );
}
