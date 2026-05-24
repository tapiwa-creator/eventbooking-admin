import { useState, useEffect, useRef } from "react";

// Swap out your font family string here if needed
const FONT = "'Inter', sans-serif";

export const PAGE_META = {
  "/dashboard": { title: "Dashboard",      subtitle: "Welcome back, here's what's happening" },
  "/events":    { title: "All Events",   subtitle: "Browse and manage your events" },
  "/add-event": { title: "Create Event", subtitle: "Set up a new event" },
  "/bookings":  { title: "Bookings",      subtitle: "View and manage bookings" },
  "/settings":  { title: "Settings",      subtitle: "Manage your account and preferences" },
};

const navGroups = [
  {
    label: "Menu",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        ),
      },
      {
        label: "All Events",
        path: "/events",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        ),
      },
      {
        label: "Create Event",
        path: "/add-event",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Features",
    items: [
      {
        label: "Bookings",
        path: "/bookings",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
            <path d="M2 20c0-3.31 4.48-6 10-6s10 2.69 10 6"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "General",
    items: [
      {
        label: "Settings",
        path: "/settings",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        ),
      },
    ],
  },
];

// ── Logout modal ──────────────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <>
      <div onClick={onCancel} style={{
        position: "fixed", inset: 0,
        background: "rgba(10,30,18,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 200, animation: "lgFadeIn 0.15s ease",
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 201,
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
        padding: "32px 28px 24px",
        width: "340px",
        fontFamily: FONT,
        animation: "lgPopIn 0.18s ease",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "14px",
          background: "#fef2f2",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: 700, color: "#111827", textAlign: "center" }}>
          Sign out?
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: "13.5px", color: "#6b7280", textAlign: "center", lineHeight: 1.6 }}>
          You'll be returned to the login screen. Any unsaved changes will be lost.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel}
            style={{
              flex: 1, padding: "11px", borderRadius: "10px",
              border: "1.5px solid #e5e7eb", background: "#fff",
              fontSize: "14px", fontWeight: 600, color: "#374151",
              cursor: "pointer", fontFamily: FONT,
              transition: "background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseOut={e => e.currentTarget.style.background = "#fff"}
          >Cancel</button>
          <button onClick={onConfirm}
            style={{
              flex: 1, padding: "11px", borderRadius: "10px",
              border: "none", background: "#1a3d28",
              fontSize: "14px", fontWeight: 600, color: "#fff",
              cursor: "pointer", fontFamily: FONT,
              transition: "background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#256639"}
            onMouseOut={e => e.currentTarget.style.background = "#1a3d28"}
          >Sign out</button>
        </div>
      </div>
      <style>{`
        @keyframes lgFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes lgPopIn  {
          from{opacity:0;transform:translate(-50%,-48%) scale(0.96)}
          to{opacity:1;transform:translate(-50%,-50%) scale(1)}
        }
      `}</style>
    </>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export default function Sidebar({ currentPath, onNavigate, onLogout, user }) {
  const [showLogout, setShowLogout]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  const firstName = user?.firstName || (user?.email ? user.email.split("@")[0].split(".")[0] : "User");
  const lastName  = user?.lastName  || "";
  const fullName  = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const role    = user?.role || "Admin Officer";
  const initials = (firstName[0] || "U").toUpperCase() + (lastName[0] || "").toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .sb-nav-btn { transition: background 0.12s, color 0.12s; }
        .sb-menu-item:hover { background: #f9fafb !important; }
        .sb-user-row:hover  { background: rgba(255, 255, 255, 0.05) !important; }
      `}</style>

      <aside style={{
        position: "fixed", top: 0, left: 0,
        width: "230px", height: "100vh",
        background: "#1a2e1f",
        borderRight: "0.5px solid rgba(255, 255, 255, 0.08)",
        display: "flex", flexDirection: "column",
        zIndex: 100, fontFamily: FONT,
        overflowY: "auto", overflowX: "hidden",
      }}>

        {/* ── Brand ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "20px 22px 18px",
          borderBottom: "0.5px solid rgba(255, 255, 255, 0.08)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}>
            <img
              src="/sda.png"
              alt="AdventSphere"
              style={{ width: 26, height: 26, objectFit: "contain", display: "block" }}
              onError={e => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML = `<span style="color:#ffffff;font-weight:800;font-size:15px;font-family:${FONT}">A</span>`;
              }}
            />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.3px", lineHeight: 1.1 }}>
              AdventSphere
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", fontWeight: 500, color: "#a8bfaf", letterSpacing: "0.1px" }}>
               Admin
            </p>
          </div>
        </div>

        {/* ── Nav groups ── */}
        <div style={{ flex: 1, padding: "4px 12px" }}>
          {navGroups.map(group => (
            <div key={group.label} style={{ marginTop: "20px" }}>
              <p style={{
                margin: "0 0 4px 8px",
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "1.4px", textTransform: "uppercase",
                color: "#b8ccbc",
              }}>
                {group.label}
              </p>

              {group.items.map(item => {
                const active = currentPath === item.path;
                return (
                  <button
                    key={item.label}
                    className="sb-nav-btn"
                    onClick={() => onNavigate(item.path)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      width: "100%", padding: "10px 12px",
                      borderRadius: "10px", marginBottom: "2px",
                      border: "none",
                      background: active ? "rgba(74, 179, 96, 0.15)" : "transparent",
                      color: active ? "#4ab360" : "#a8bfaf",
                      fontSize: "14px", fontWeight: active ? 600 : 500,
                      fontFamily: FONT, cursor: "pointer", textAlign: "left",
                      boxShadow: "none",
                      transition: "background 0.12s, color 0.12s, box-shadow 0.12s",
                    }}
                    onMouseOver={e => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseOut={e => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#a8bfaf";
                      }
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── User footer ── */}
        <div ref={userMenuRef} style={{ padding: "14px 12px", borderTop: "0.5px solid rgba(255, 255, 255, 0.08)", position: "relative" }}>

          {userMenuOpen && (
            <div style={{
              position: "absolute", bottom: "calc(100% + 4px)",
              left: "12px", right: "12px",
              background: "#fff",
              border: "1.5px solid #e4e8e4",
              borderRadius: "12px",
              boxShadow: "0 8px 28px rgba(26,61,40,0.12)",
              overflow: "hidden", zIndex: 50,
              animation: "lgFadeIn 0.12s ease",
            }}>
              <button
                className="sb-menu-item"
                onClick={() => { setUserMenuOpen(false); setShowLogout(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  width: "100%", padding: "12px 14px",
                  border: "none", background: "transparent",
                  fontSize: "13.5px", fontWeight: 600,
                  color: "#374151", cursor: "pointer",
                  fontFamily: FONT, textAlign: "left",
                  transition: "background 0.12s",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          )}

          <button
            className="sb-user-row"
            onClick={() => setUserMenuOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              width: "100%", padding: "10px",
              borderRadius: "10px", border: "none", background: "transparent",
              cursor: "pointer", fontFamily: FONT, textAlign: "left",
              transition: "background 0.12s",
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700, color: "#ffffff", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {fullName}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "#a8bfaf" }}>{role}</p>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a8bfaf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </aside>

      {showLogout && (
        <LogoutModal
          onConfirm={() => { setShowLogout(false); onLogout?.(); }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
}