// CreateEventView.jsx
import { useState } from "react";
import { createEvent } from "../Services/CreateEventServices";

const MINISTRY_CATEGORIES = [
    { tag: "CHILDREN", label: "Children's Ministries" },
    { tag: "YOUTH", label: "Youth Ministries" },
    { tag: "WOMEN", label: "Women's Ministries" },
    { tag: "MEN", label: "Men's Ministries" },
    { tag: "CAMPUS", label: "Public Campus Ministries" },
    { tag: "WISPA", label: "WISPA" },
    { tag: "MUSIC", label: "Music Ministries" },
];

const TAG_COLORS = {
    CHILDREN: "#f59e0b", YOUTH: "#3b82f6", WOMEN: "#ec4899",
    MEN: "#0ea5e9", CAMPUS: "#8b5cf6", WISPA: "#14b8a6", MUSIC: "#f97316",
};

const CURRENCIES = [
    { code: "USD", label: "US Dollar (USD)" },
    { code: "ZAR", label: "Rand (ZAR)" },
    { code: "EUR", label: "Euro (EUR)" },
    { code: "GBP", label: "Pound (GBP)" },
    { code: "ZWL", label: "Zimbabwe Dollar (ZWL)" },
];

const PRICING_MODES = [
    { id: "flat", title: "Flat / Free", desc: "Single price or free entry for all attendees" },
    { id: "packages", title: "Packages", desc: "General / VIP / VVIP or custom ticket categories" },
];

const DEFAULT_TIERS = [
    { id: "general", label: "General", price: "" },
    { id: "vip", label: "VIP", price: "" },
    { id: "vvip", label: "VVIP", price: "" },
];

const BLANK_FORM = {
    title: "", description: "", date: "", time: "",
    deadline: "", location: "", capacity: "",
    status: "Upcoming", tag: "CHILDREN",
    currency: "ZAR", pricingMode: "flat", price: "", unit: "ticket",
};

const STATUS_OPTIONS = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

const inp = {
    height: "44px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    padding: "0 14px",
    fontSize: "14px",
    fontWeight: 400,
    color: "#111827",
    background: "#fff",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
};

function Field({ label, children, half }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: half ? "1 1 0" : undefined }}>
            <label style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>{label}</label>
            {children}
        </div>
    );
}

function focusStyle(e) { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }
function blurStyle(e) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }

function Toast({ message, type }) {
    const ok = type === "success";
    return (
        <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1100,
            display: "flex", alignItems: "center", gap: "10px",
            background: ok ? "#f0fdf4" : "#fef2f2",
            border: `1.5px solid ${ok ? "#86efac" : "#fca5a5"}`,
            borderRadius: "12px", padding: "14px 20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            fontSize: "14px",
            fontWeight: 600,
            color: ok ? "#166534" : "#991b1b",
            whiteSpace: "nowrap",
            animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
            {ok ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            )}
            {message}
            <style>{`@keyframes slideUp { from { opacity:0; transform:translate(-50%,-50%) scale(0.9); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }`}</style>
        </div>
    );
}

export default function CreateEventView({ onBack, onCreated }) {
    const [form, setForm] = useState(BLANK_FORM);
    const [tiers, setTiers] = useState(DEFAULT_TIERS.map(t => ({ ...t })));
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const updateTierPrice = (id, val) => setTiers(p => p.map(t => t.id === id ? { ...t, price: val } : t));
    const updateTierLabel = (id, val) => setTiers(p => p.map(t => t.id === id ? { ...t, label: val } : t));
    const addCustomTier = () => setTiers(p => [...p, { id: `custom_${Date.now()}`, label: "", price: "" }]);
    const removeTier = id => setTiers(p => p.filter(t => t.id !== id));

    const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleImage = e => {
        const f = e.target.files?.[0];
        if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
    };

    const resetForm = () => {
        setForm(BLANK_FORM);
        setTiers(DEFAULT_TIERS.map(t => ({ ...t })));
        setFile(null); setPreview(null);
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) return;
        try {
            setLoading(true);
            const priceNum = parseFloat(form.price.toString().replace(/[^0-9.]/g, "")) || 0;
            const categoryLabel = MINISTRY_CATEGORIES.find(c => c.tag === form.tag)?.label ?? form.tag;

            const parsedTiers = tiers
                .filter(t => t.label.trim())
                .map(t => ({
                    id: t.id,
                    label: t.label.trim(),
                    price: parseFloat(String(t.price).replace(/[^0-9.]/g, "")) || 0,
                    unit: form.unit || "ticket",
                }));

            const eventData = {
                title: form.title, description: form.description,
                date: form.date, time: form.time, deadline: form.deadline,
                location: form.location, capacity: form.capacity,
                status: form.status, tag: form.tag,
                tagColor: TAG_COLORS[form.tag] ?? "#14532d",
                tagLabel: categoryLabel,
                price: form.pricingMode === "packages"
                    ? "Packages"
                    : priceNum > 0 ? `${form.currency} ${priceNum}` : "Free",
                priceNum, unit: form.unit,
                pricing: { mode: form.pricingMode, currency: form.currency, price: priceNum, unit: form.unit },
                tiers: form.pricingMode === "packages" ? parsedTiers : [],
            };

            const newId = await createEvent(eventData, file || null);
            if (typeof onCreated === "function") onCreated({ id: newId, ...eventData });
            resetForm();
            showToast("Event created successfully!", "success");
        } catch (err) {
            console.error("Failed to create event:", err);
            showToast("Failed to create event. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const card = {
        background: "#fff", borderRadius: "16px",
        padding: "28px 32px", border: "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "20px",
    };

    const SectionTitle = ({ title, sub }) => (
        <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>{title}</h2>
            {sub && <p style={{ margin: "3px 0 0", fontSize: "14px", fontWeight: 400, color: "#6B7280" }}>{sub}</p>}
        </div>
    );

    const hint = { fontSize: "12px", fontWeight: 400, color: "#9CA3AF" };

    const currencySym = { USD: "$", ZAR: "R", EUR: "€", GBP: "£", ZWL: "Z$" }[form.currency] ?? form.currency;

    // ── Green palette (matches dashboard sidebar #4ab360 / #3d7a4a) ──────────
    const GREEN        = "#3d7a4a";   // primary green — same as dashboard brand
    const GREEN_HOVER  = "#2e5e38";   // darker on hover
    const GREEN_DIS    = "#a0c8aa";   // disabled state
    const GREEN_BG     = "#f0f7f1";   // soft green background for active pricing card
    const GREEN_RING   = "rgba(61,122,74,0.18)";

    return (
        <div className="font-sans bg-gray-50" style={{ minHeight: "100vh", overflowY: "auto", boxSizing: "border-box", padding: "32px 40px" }}>
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>
                    Create New Event
                </h1>
                <p style={{ fontSize: "14px", fontWeight: 400, color: "#6B7280", margin: "4px 0 0" }}>
                    Fill in the details below to publish your event
                </p>
            </div>

            {/* ── Event Details + Image ── */}
            <div style={card}>
                <div style={{ display: "flex", gap: "48px" }}>

                    {/* LEFT */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
                        <SectionTitle title="Event Details" sub="Basic information about your event" />

                        <Field label="Event Title">
                            <input placeholder="e.g. Women's Prayer Retreat 2025"
                                value={form.title} onChange={set("title")}
                                style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                        </Field>

                        <Field label="Description">
                            <textarea placeholder="Describe your event…" value={form.description}
                                onChange={set("description")} rows={4}
                                style={{ ...inp, height: "auto", padding: "12px 14px", resize: "vertical", lineHeight: 1.6 }}
                                onFocus={focusStyle} onBlur={blurStyle} />
                        </Field>

                        <div style={{ display: "flex", gap: "14px" }}>
                            <Field label="Date" half>
                                <input type="date" value={form.date} onChange={set("date")}
                                    style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                            </Field>
                            <Field label="Time" half>
                                <input type="time" value={form.time} onChange={set("time")}
                                    style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                            </Field>
                        </div>

                        <Field label="Registration Deadline">
                            <input type="date" value={form.deadline} onChange={set("deadline")}
                                max={form.date || undefined}
                                style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                            {form.deadline && form.date && form.deadline > form.date && (
                                <p style={{ fontSize: "12px", color: "#ef4444", margin: "2px 0 0 2px" }}>
                                    Deadline cannot be after the event date.
                                </p>
                            )}
                        </Field>

                        <Field label="Location">
                            <input placeholder="e.g. Harare Adventist Centre"
                                value={form.location} onChange={set("location")}
                                style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                        </Field>

                        <div style={{ display: "flex", gap: "14px" }}>
                            <Field label="Total Capacity" half>
                                <input type="number" placeholder="Max attendees"
                                    value={form.capacity} onChange={set("capacity")}
                                    style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                            </Field>
                            <Field label="Status" half>
                                <select value={form.status} onChange={set("status")}
                                    style={{ ...inp, cursor: "pointer" }}
                                    onFocus={focusStyle} onBlur={blurStyle}>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                        </div>

                        <Field label="Ministry Category">
                            <select value={form.tag} onChange={set("tag")}
                                style={{
                                    ...inp, cursor: "pointer", fontWeight: 600,
                                    color: TAG_COLORS[form.tag] ?? "#111827",
                                    borderColor: TAG_COLORS[form.tag] ?? "#e5e7eb",
                                    boxShadow: `0 0 0 3px ${TAG_COLORS[form.tag] ?? "#e5e7eb"}22`,
                                }}
                                onFocus={focusStyle} onBlur={blurStyle}>
                                {MINISTRY_CATEGORIES.map(c => (
                                    <option key={c.tag} value={c.tag}>{c.label}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* RIGHT: image + publish */}
                    <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                        <SectionTitle title="Event Image" sub="Uploaded to Firebase Storage" />

                        <div style={{
                            border: "1.5px dashed #d1d5db", borderRadius: "12px", height: "200px",
                            display: "flex", flexDirection: "column", alignItems: "center",
                            justifyContent: "center", overflow: "hidden",
                            background: "#fafafa", position: "relative", cursor: "pointer",
                        }}>
                            {preview ? (
                                <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                        stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <p style={{ margin: "10px 0 4px", fontSize: "14px", fontWeight: 500, color: "#6B7280" }}>
                                        Click to upload image
                                    </p>
                                    <p style={{ margin: 0, ...hint }}>PNG, JPG, WEBP up to 10 MB</p>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImage}
                                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                        </div>

                        <label style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            padding: "11px", border: "1.5px solid #e5e7eb", borderRadius: "8px",
                            fontSize: "14px", fontWeight: 500, color: "#374151",
                            cursor: "pointer", background: "#fff", transition: "border-color 0.15s",
                        }}
                            onMouseOver={e => e.currentTarget.style.borderColor = GREEN}
                            onMouseOut={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            {file ? "Change Image" : "Upload Image"}
                            <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                        </label>

                        {file && (
                            <p style={{ margin: 0, ...hint, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {file.name}
                            </p>
                        )}

                        {/* ── PUBLISH BUTTON — green ── */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !form.title.trim()}
                            style={{
                                marginTop: "auto", width: "100%", padding: "13px",
                                background: loading || !form.title.trim() ? GREEN_DIS : GREEN,
                                color: "#fff", border: "none", borderRadius: "8px",
                                fontSize: "14px", fontWeight: 700,
                                cursor: loading || !form.title.trim() ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                transition: "background 0.2s",
                            }}
                            onMouseOver={e => { if (!loading && form.title.trim()) e.currentTarget.style.background = GREEN_HOVER; }}
                            onMouseOut={e => { if (!loading && form.title.trim()) e.currentTarget.style.background = GREEN; }}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                    Creating…
                                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    Publish Event
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Booking & Pricing ── */}
            <div style={card}>
                <SectionTitle title="Booking & Pricing" sub="Choose how attendees book and pay" />

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 500, color: "#111827", display: "block", marginBottom: "6px" }}>
                        Currency
                    </label>
                    <select value={form.currency} onChange={set("currency")}
                        style={{ ...inp, width: "220px", cursor: "pointer" }}
                        onFocus={focusStyle} onBlur={blurStyle}>
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                </div>

                <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
                    {PRICING_MODES.map(mode => {
                        const active = form.pricingMode === mode.id;
                        return (
                            <div key={mode.id}
                                onClick={() => setForm(p => ({ ...p, pricingMode: mode.id }))}
                                style={{
                                    flex: 1, padding: "16px 18px",
                                    // ── active card: green border + green tinted bg ──
                                    border: active ? `2px solid ${GREEN}` : "1.5px solid #e5e7eb",
                                    borderRadius: "12px",
                                    background: active ? GREEN_BG : "#fff",
                                    cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
                                }}
                                onMouseOver={e => { if (!active) e.currentTarget.style.borderColor = "#a0c8aa"; }}
                                onMouseOut={e => { if (!active) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                    <div style={{
                                        width: "14px", height: "14px", borderRadius: "50%",
                                        border: active ? "none" : "2px solid #d1d5db",
                                        // ── active radio dot: green ──
                                        background: active ? GREEN : "transparent",
                                        flexShrink: 0,
                                        boxShadow: active ? `0 0 0 3px ${GREEN_RING}` : "none",
                                    }} />
                                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{mode.title}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: "12px", fontWeight: 400, color: "#6B7280", lineHeight: 1.5 }}>{mode.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Flat */}
                {form.pricingMode === "flat" && (
                    <div>
                        <label style={{ fontSize: "14px", fontWeight: 500, color: "#111827", display: "block", marginBottom: "6px" }}>
                            Ticket Price{" "}
                            <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(leave 0 for free)</span>
                        </label>
                        <div style={{ position: "relative", width: "200px" }}>
                            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", fontWeight: 500, color: "#6B7280" }}>
                                {currencySym}
                            </span>
                            <input type="number" placeholder="0.00" value={form.price} onChange={set("price")}
                                style={{ ...inp, paddingLeft: "34px" }} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>
                    </div>
                )}

                {/* Packages */}
                {form.pricingMode === "packages" && (
                    <div>
                        <label style={{ fontSize: "14px", fontWeight: 500, color: "#111827", display: "block", marginBottom: "12px" }}>
                            Ticket Tiers
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {tiers.map((tier, idx) => (
                                <div key={tier.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input
                                        placeholder={idx < 3 ? ["General", "VIP", "VVIP"][idx] : "Custom tier name"}
                                        value={tier.label}
                                        onChange={e => updateTierLabel(tier.id, e.target.value)}
                                        style={{ ...inp, width: "160px" }}
                                        onFocus={focusStyle} onBlur={blurStyle}
                                    />
                                    <div style={{ position: "relative", width: "150px" }}>
                                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", fontWeight: 500, color: "#6B7280" }}>
                                            {currencySym}
                                        </span>
                                        <input type="number" placeholder="0.00" value={tier.price}
                                            onChange={e => updateTierPrice(tier.id, e.target.value)}
                                            style={{ ...inp, paddingLeft: "30px" }}
                                            onFocus={focusStyle} onBlur={blurStyle}
                                        />
                                    </div>
                                    {tiers.length > 1 && (
                                        <button onClick={() => removeTier(tier.id)} style={{
                                            background: "none", border: "1.5px solid #fca5a5",
                                            borderRadius: "6px", padding: "6px 10px", cursor: "pointer",
                                            color: "#ef4444", fontSize: "14px", fontWeight: 500,
                                            fontFamily: "inherit", flexShrink: 0,
                                        }}>✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={addCustomTier} style={{
                            marginTop: "12px", background: "none",
                            // ── "Add Custom Tier" dashed button: green to match brand ──
                            border: `1.5px dashed ${GREEN_DIS}`,
                            borderRadius: "8px",
                            padding: "8px 16px", cursor: "pointer",
                            color: GREEN, fontSize: "14px", fontWeight: 500,
                            fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px",
                        }}>
                            + Add Custom Tier
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}