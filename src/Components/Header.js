import { useState, useEffect, useRef } from "react";

const FONT = "'Inter', sans-serif";

// ── Calendar dropdown ─────────────────────────────────────────────────────────
function DateDropdown({ onClose }) {
  const ref = useRef(null);
  const today = new Date();

  const [viewing, setViewing] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const monthLabel = new Date(
    viewing.year,
    viewing.month,
    1
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(viewing.year, viewing.month, 1).getDay();

  const daysInMonth = new Date(
    viewing.year,
    viewing.month + 1,
    0
  ).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const isToday = (d) =>
    d === today.getDate() &&
    viewing.month === today.getMonth() &&
    viewing.year === today.getFullYear();

  const prev = () =>
    setViewing((v) => ({
      month: v.month === 0 ? 11 : v.month - 1,
      year: v.month === 0 ? v.year - 1 : v.year,
    }));

  const next = () =>
    setViewing((v) => ({
      month: v.month === 11 ? 0 : v.month + 1,
      year: v.month === 11 ? v.year + 1 : v.year,
    }));

  return (
    <>
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          background: "#fff",
          border: "1.5px solid #e4e8e4",
          borderRadius: "16px",
          boxShadow:
            "0 12px 40px rgba(26,61,40,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          padding: "20px",
          width: "280px",
          zIndex: 200,
          fontFamily: FONT,
          animation: "ddFade 0.15s ease",
        }}
      >
        {/* Month nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={prev}
            style={{
              border: "1.5px solid #e4e8e4",
              background: "#fff",
              cursor: "pointer",
              width: 30,
              height: 30,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7a9984",
              fontSize: "15px",
              fontFamily: FONT,
              transition: "background 0.12s, border-color 0.12s",
            }}
          >
            ‹
          </button>

          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111c16",
            }}
          >
            {monthLabel}
          </span>

          <button
            onClick={next}
            style={{
              border: "1.5px solid #e4e8e4",
              background: "#fff",
              cursor: "pointer",
              width: 30,
              height: 30,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7a9984",
              fontSize: "15px",
              fontFamily: FONT,
              transition: "background 0.12s, border-color 0.12s",
            }}
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: "2px",
            marginBottom: "6px",
          }}
        >
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: "#b8ccbc",
                padding: "2px 0",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: "2px",
          }}
        >
          {cells.map((d, i) => (
            <div
              key={i}
              onClick={() => d && onClose()}
              style={{
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: isToday(d) ? 700 : 400,
                color: d ? (isToday(d) ? "#fff" : "#3d5447") : "transparent",
                background: isToday(d) ? "#1a3d28" : "transparent",
                cursor: d ? "pointer" : "default",
                transition: "background 0.12s",
              }}
            >
              {d || ""}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1.5px solid #eef0ee",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#a8bfaf",
              fontWeight: 500,
            }}
          >
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes ddFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header() {
  // OPEN BY DEFAULT
  const [dateOpen, setDateOpen] = useState(true);

  const today = new Date();

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: "230px",
          right: 0,
          zIndex: 50,
          height: "64px",
          background: "#ffffff",
          borderBottom: "1.5px solid #e4e8e4",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT,
          boxShadow: "0 1px 6px rgba(26,61,40,0.06)",
        }}
      >
        {/* Removed Dashboard Text */}
        <div />

        {/* Date picker */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDateOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              borderRadius: "10px",
              border: `1.5px solid ${
                dateOpen ? "#1a3d28" : "#e4e8e4"
              }`,
              background: dateOpen ? "#f0faf4" : "#fff",
              fontSize: "13px",
              fontWeight: 600,
              color: dateOpen ? "#1a3d28" : "#3d5447",
              fontFamily: FONT,
              cursor: "pointer",
              boxShadow: dateOpen
                ? "0 0 0 3px rgba(26,61,40,0.10)"
                : "none",
              transition: "all 0.15s",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>

            {displayDate}

            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: dateOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dateOpen && (
            <DateDropdown onClose={() => setDateOpen(false)} />
          )}
        </div>
      </header>
    </>
  );
}