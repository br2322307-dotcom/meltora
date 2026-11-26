export default function Footer({ state, actions }) {
  return (
    <footer className="site-footer">
      <svg className="footer-wave-bg" viewBox="0 0 430 50" preserveAspectRatio="none">
        <path d="M0 30 Q110 5 220 28 T430 22 L430 50 L0 50 Z" fill="#9E581A" />
        <path d="M0 38 Q140 18 280 38 T430 32 L430 50 L0 50 Z" fill="#C47627" />
      </svg>

      <div className="footer-columns">
        <div className="footer-brand-col">
          <svg width="18" height="11" viewBox="0 0 32 20" fill="none" style={{ marginBottom: "-2px" }}>
            <path d="M15 15C13 8 7 5 3 6C4 11 9 15 15 15Z" fill="#EAB543" />
            <path d="M16 14C19 7 25 3 30 4C28 10 22 14 16 14Z" fill="#F8CA49" />
          </svg>
          <div className="f-logo">Meltora</div>
          <div className="f-tag">
            <i />
            <span>Taste the Purity</span>
            <i />
          </div>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul className="footer-list">
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  actions.navigateTo("home");
                }}
              >
                <span>🏠 Home</span>
              </a>
            </li>
            <li>
              <a
                href="#explore-choco"
                onClick={(e) => {
                  e.preventDefault();
                  actions.navigateTo("explore", { category: "chocolate" });
                }}
              >
                <span>🍫 Chocolates</span>
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
                <span>🍯 Desi Ghee</span>
              </a>
            </li>
            <li>
              <a
                href="#scan-qr"
                onClick={(e) => {
                  e.preventDefault();
                  actions.navigateTo("scan");
                }}
              >
                <span>📷 Scan QR Hub</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Direct Connect</h5>
          <ul className="footer-list">
            <li>
              <a href={`tel:${state.callNumber}`}>
                <span>📞 Call {state.callDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href="#wa-choco"
                onClick={(e) => {
                  e.preventDefault();
                  actions.redirectToWhatsApp({ category: "chocolate" });
                }}
              >
                <span>💬 Chocolate WhatsApp</span>
              </a>
            </li>
            <li>
              <a
                href="#wa-ghee"
                onClick={(e) => {
                  e.preventDefault();
                  actions.redirectToWhatsApp({ category: "ghee" });
                }}
              >
                <span>💬 Desi Ghee WhatsApp</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© 2026 Meltora. All Rights Reserved.</span>
        <span>Scan • Explore • WhatsApp</span>
      </div>
    </footer>
  );
}
