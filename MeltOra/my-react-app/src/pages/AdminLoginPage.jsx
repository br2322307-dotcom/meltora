import { useState } from "react";

export default function AdminLoginPage({ state, actions }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.loginAdmin({ username, password });
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <svg className="brand-leaves" viewBox="0 0 32 20" fill="none">
            <path d="M15 15C13 8 7 5 3 6C4 11 9 15 15 15Z" fill="#EAB543" />
            <path d="M16 14C19 7 25 3 30 4C28 10 22 14 16 14Z" fill="#F8CA49" />
          </svg>
          <h1>MeltOra - Admin</h1>
          <p>Sign in to customize products, banners, WhatsApp routing &amp; manage orders</p>
        </div>

        {state.adminAuthChecking ? (
          <div className="admin-checking-box">Verifying session...</div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-login-form">
            {state.adminLoginError && (
              <div className="admin-error-alert">⚠️ {state.adminLoginError}</div>
            )}

            <div className="c-field">
              <label className="c-label" htmlFor="admin-user-id">
                User ID
              </label>
              <input
                id="admin-user-id"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Admin User ID"
                autoComplete="username"
                className="sheet-input"
                required
              />
            </div>

            <div className="c-field">
              <label className="c-label" htmlFor="admin-password">
                Password
              </label>
              <div className="admin-pass-row">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Admin Password"
                  autoComplete="current-password"
                  className="sheet-input"
                  required
                />
                <button
                  type="button"
                  className="pass-toggle-btn"
                  onClick={() => setShowPass((prev) => !prev)}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="c-submit-btn">
              🔓 Unlock MeltOra - Admin
            </button>
          </form>
        )}

        <a href="/" className="admin-back-customer">
          ← Open Customer Website (/)
        </a>
      </div>
    </div>
  );
}
