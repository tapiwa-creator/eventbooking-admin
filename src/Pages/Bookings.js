import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

const BOOKINGS_DATA = [
    { id: 1, name: "Comfort Tapiwa Mkunyadze", email: "tapiwacomfort086@gmail.com", phone: "0781406806", event: "Winter Youth Camp", tickets: 1, status: "Confirmed", bookedOn: "May 19, 2026" },
    { id: 2, name: "Comfort Tapiwa Mkunyadze", email: "tapiwacomfort086@gmail.com", phone: "0781406806", event: "Winter Youth Camp", tickets: 1, status: "Confirmed", bookedOn: "May 19, 2026" },
    { id: 3, name: "Comfort Tapiwa Mkunyadze", email: "tapiwacomfort086@gmail.com", phone: "0781972985", event: "Winter Youth Camp", tickets: 2, status: "Confirmed", bookedOn: "May 19, 2026" },
    { id: 4, name: "Comfort Tapiwa Mkunyadze", email: "tapiwacomfort086@gmail.com", phone: "0781406806", event: "Public Campus Ministries", tickets: 1, status: "Confirmed", bookedOn: "May 19, 2026" },
    { id: 5, name: "Comfort Tapiwa Mkunyadze", email: "tapiwacomfort086@gmail.com", phone: "0771111111", event: "Winter Youth Camp", tickets: 3, status: "Confirmed", bookedOn: "May 18, 2026" },
    { id: 6, name: "Tatenda Moyo", email: "tatenda@gmail.com", phone: "0772345678", event: "Public Campus Ministries", tickets: 2, status: "Confirmed", bookedOn: "May 17, 2026" },
    { id: 7, name: "Rudo Chikwanda", email: "rudo@gmail.com", phone: "0773456789", event: "Winter Youth Camp", tickets: 1, status: "Failed", bookedOn: "May 16, 2026" },
    { id: 8, name: "Farai Nhema", email: "farai@gmail.com", phone: "0774567890", event: "Winter Youth Camp", tickets: 2, status: "Confirmed", bookedOn: "May 15, 2026" },
    { id: 9, name: "Simba Dube", email: "simba@gmail.com", phone: "0775678901", event: "Public Campus Ministries", tickets: 1, status: "Failed", bookedOn: "May 14, 2026" },
    { id: 10, name: "Nyasha Banda", email: "nyasha@gmail.com", phone: "0776789012", event: "Winter Youth Camp", tickets: 4, status: "Confirmed", bookedOn: "May 13, 2026" },
];

const FONT = "'Inter', sans-serif";

function StatusBadge({ status }) {
    const cfg = {
        Confirmed: { bg: "#d1fae5", color: "#065f46", label: "Confirmed" },
        Failed: { bg: "#fee2e2", color: "#991b1b", label: "Failed" },
        Pending: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
    }[status] || { bg: "#f3f4f6", color: "#374151", label: status };
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: cfg.bg, color: cfg.color,
            padding: "3px 10px", borderRadius: 999,
            fontSize: 12, fontWeight: 700, fontFamily: FONT,
        }}>
            {cfg.label}
        </span>
    );
}

function TicketBadge({ count }) {
    return (
        <span style={{
            display: "inline-block", background: "#d1fae5", color: "#064e3b",
            padding: "3px 11px", borderRadius: 999,
            fontSize: 12, fontWeight: 700, fontFamily: FONT,
        }}>
            {count} {count === 1 ? "ticket" : "tickets"}
        </span>
    );
}

function exportEventExcel(eventName, rows) {
    const wb = XLSX.utils.book_new();
    const data = rows.map(b => ({
        Attendee: b.name,
        Email: b.email,
        Phone: b.phone,
        Event: b.event,
        Tickets: b.tickets,
        Status: b.status,
        "Booked On": b.bookedOn,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [26, 32, 14, 28, 10, 12, 14].map(w => ({ wch: w }));
    const sheetName = eventName.replace(/[\\/?*[\]:]/g, "").slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const filename = `bookings_${eventName.replace(/\s+/g, "_").toLowerCase()}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function exportEventPDF(eventName, rows) {
    const css = `
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 32px 36px; color: #18103a; }
    h1  { font-size: 22px; font-weight: 800; margin: 0 0 4px; }
    .sub { font-size: 13px; color: #6b7280; margin: 0 0 28px; }
    .event-block { margin-bottom: 36px; }
    .event-header {
      display: flex; justify-content: space-between; align-items: center;
      background: #f5f3ff; border-left: 4px solid #047857;
      padding: 10px 16px; border-radius: 8px 8px 0 0;
    }
    .event-name { font-size: 15px; font-weight: 700; color: #18103a; }
    .event-meta { font-size: 12px; color: #6b7280; display: flex; gap: 12px; flex-wrap: wrap; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    thead tr { background: #f9fafb; }
    th { padding: 9px 12px; text-align: left; font-weight: 700; color: #6b7280;
         border-bottom: 2px solid #e5e7eb; white-space: nowrap; }
    td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .att-name  { font-weight: 700; color: #18103a; }
    .att-sub   { font-size: 11.5px; color: #6b7280; margin-top: 2px; }
    .badge     { display:inline-block; padding:2px 9px; border-radius:999px; font-weight:700; font-size:11px; }
    .b-confirmed { background:#d1fae5; color:#065f46; }
    .b-failed    { background:#fee2e2; color:#991b1b; }
    .b-pending   { background:#fef3c7; color:#92400e; }
    .b-ticket    { background:#d1fae5; color:#064e3b; }
    .footer { margin-top:32px; font-size:11px; color:#9ca3af; text-align:center; border-top:1px solid #f3f4f6; padding-top:16px; }
  `;
    const badgeClass = s => ({ Confirmed: "b-confirmed", Failed: "b-failed", Pending: "b-pending" }[s] || "");
    const totalTickets = rows.reduce((s, b) => s + b.tickets, 0);

    const body = `
    <h1>${eventName}</h1>
    <p class="sub">Exported on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
    <div class="event-block">
      <div class="event-header">
        <span class="event-name">${eventName}</span>
        <span class="event-meta"><span>${totalTickets} ticket${totalTickets !== 1 ? "s" : ""} sold</span></span>
      </div>
      <table>
        <thead><tr>
          <th>Attendee</th><th>Tickets</th><th>Status</th><th>Booked On</th>
        </tr></thead>
        <tbody>
          ${rows.map(b => `
            <tr>
              <td>
                <div class="att-name">${b.name}</div>
                <div class="att-sub">${b.email}</div>
                <div class="att-sub">${b.phone}</div>
              </td>
              <td><span class="badge b-ticket">${b.tickets} ticket${b.tickets !== 1 ? "s" : ""}</span></td>
              <td><span class="badge ${badgeClass(b.status)}">${b.status}</span></td>
              <td>${b.bookedOn}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="footer">AdventSphere Admin Portal &bull; Generated ${new Date().toLocaleString()}</div>`;

    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${eventName} Bookings</title><style>${css}</style></head><body>${body}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
}

function ExportBtn({ label, onClick, color }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button onClick={onClick}
            onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}
            style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 13px", borderRadius: 8, border: `1.5px solid ${color}`,
                background: hovered ? color : "#fff",
                color: hovered ? "#fff" : color,
                fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer",
                transition: "all 0.15s",
            }}>
            {label}
        </button>
    );
}

function AttendeeRow({ booking }) {
    return (
        <tr>
            <td style={{ padding: "11px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#18103a", fontFamily: FONT }}>{booking.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, fontFamily: FONT }}>{booking.email}</div>
                <div style={{ fontSize: 12, color: "#6b7280", fontFamily: FONT }}>{booking.phone}</div>
            </td>
            <td style={{ padding: "11px 20px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#374151", fontFamily: FONT }}>{booking.event}</td>
            <td style={{ padding: "11px 20px", borderBottom: "1px solid #f3f4f6" }}><TicketBadge count={booking.tickets} /></td>
            <td style={{ padding: "11px 20px", borderBottom: "1px solid #f3f4f6" }}><StatusBadge status={booking.status} /></td>
            <td style={{ padding: "11px 20px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#6b7280", fontFamily: FONT }}>{booking.bookedOn}</td>
        </tr>
    );
}

export default function AllBookings() {
    const [search, setSearch] = useState("");

    const isSearching = search.trim().length > 0;

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return BOOKINGS_DATA;
        return BOOKINGS_DATA.filter(b =>
            b.name.toLowerCase().includes(q) ||
            b.email.toLowerCase().includes(q) ||
            b.phone.includes(q) ||
            b.event.toLowerCase().includes(q)
        );
    }, [search]);

    const grouped = useMemo(() =>
        filtered.reduce((acc, b) => {
            (acc[b.event] = acc[b.event] || []).push(b);
            return acc;
        }, {}),
        [filtered]);

    return (
        <div style={{ fontFamily: FONT, background: "#f9fafb", minHeight: "100vh", padding: "32px 28px" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#18103a", margin: "0 0 4px", fontFamily: FONT }}>All Bookings</h1>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0, fontFamily: FONT }}>View and manage bookings across all your events</p>
                </div>
                <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14, pointerEvents: "none" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    </span>
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search booking by attendee's name"
                        style={{
                            paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                            border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13,
                            fontFamily: FONT, outline: "none", width: 280, color: "#18103a",
                            background: "#fff", boxSizing: "border-box",
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden" }}>
                {Object.keys(grouped).length === 0 ? (
                    <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 14, fontFamily: FONT }}>
                        No bookings match your search.
                    </div>
                ) : isSearching ? (
                    /* Search mode: individual attendee rows */
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT }}>
                        <thead>
                            <tr style={{ background: "#fafafa" }}>
                                {["Attendee", "Event", "Tickets", "Status", "Booked On"].map(h => (
                                    <th key={h} style={{
                                        padding: "12px 20px", textAlign: "left", fontSize: 12,
                                        fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #f3f4f6",
                                        whiteSpace: "nowrap", fontFamily: FONT,
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => <AttendeeRow key={b.id} booking={b} />)}
                        </tbody>
                    </table>
                ) : (
                    /* Default mode: one row per event, total registrations only */
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT }}>
                        <thead>
                            <tr style={{ background: "#fafafa" }}>
                                {["Event Name", "Total Registrations", ""].map(h => (
                                    <th key={h} style={{
                                        padding: "12px 20px", textAlign: "left", fontSize: 12,
                                        fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #f3f4f6",
                                        whiteSpace: "nowrap", fontFamily: FONT,
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(grouped).map(([eventName, rows]) => {
                                const totalTickets = rows.reduce((s, b) => s + b.tickets, 0);
                                return (
                                    <tr key={eventName}>
                                        <td style={{ padding: "13px 20px", borderBottom: "1px solid #f3f4f6", fontSize: 14, fontWeight: 700, color: "#18103a", fontFamily: FONT }}>
                                            {eventName}
                                        </td>
                                        <td style={{ padding: "13px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                            <TicketBadge count={totalTickets} />
                                        </td>
                                        <td style={{ padding: "13px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <ExportBtn
                                                    label="Export Excel"
                                                    onClick={() => exportEventExcel(eventName, rows)}
                                                    color="#16a34a"
                                                />
                                                <ExportBtn
                                                    label="Export PDF"
                                                    onClick={() => exportEventPDF(eventName, rows)}
                                                    color="#dc2626"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}