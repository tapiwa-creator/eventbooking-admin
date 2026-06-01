import { useState, useEffect, useCallback } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../Services/CreateEventServices";
// ─── Icons ────────────────────────────────────────────────────────────────────

const CalendarIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
    </svg>
);

const ImagePlaceholderIcon = ({ size = "md" }) => {
    const s = size === "lg" ? "w-10 h-10" : "w-8 h-8";
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
};

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const MoreVerticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCIES = [
    { code: "ZAR", symbol: "R", label: "Rand (ZAR)" },
    { code: "USD", symbol: "$", label: "US Dollar (USD)" },
    { code: "ZiG", symbol: "ZiG", label: "ZiG (ZiG)" },
    { code: "GBP", symbol: "£", label: "Pound Sterling (GBP)" },
];

const DEFAULT_TIERS = [
    { id: "general", label: "General", color: "#059669", price: "", capacity: "" },
    { id: "vip", label: "VIP", color: "#E84393", price: "", capacity: "" },
    { id: "vvip", label: "VVIP", color: "#F4B942", price: "", capacity: "" },
];

const SEED_EVENTS = [
    {
        id: "seed-1",
        title: "Tech Conference 2026",
        description: "Annual technology conference featuring the latest innovations in AI, cloud computing, and software...",
        date: "Jun 15, 2026 at 09:00",
        location: "Convention Center, San Francisco",
        booked: "3 / 500 booked",
        status: "Upcoming",
    },
    {
        id: "seed-2",
        title: "Music Festival",
        description: "A weekend of live music featuring top artists from around the world. Multiple stages, food vendors, and...",
        date: "Jul 20, 2026 at 14:00",
        location: "Central Park, New York",
        booked: "4 / 10000 booked",
        status: "Upcoming",
    },
    {
        id: "seed-3",
        title: "Art Exhibition Opening",
        description: "Opening night of contemporary art exhibition featuring works from emerging artists. Wine and appetizers...",
        date: "May 10, 2026 at 18:00",
        location: "Modern Art Gallery, Chicago",
        booked: "0 / 150 booked",
        status: "Upcoming",
    },
];

// ─── Error Banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message, isNetwork, onDismiss }) {
    return (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
            <span className="flex-shrink-0 mt-0.5 text-red-500"><AlertIcon /></span>
            <div className="flex-1">
                <p className="font-semibold mb-0.5">{isNetwork ? "Network Error" : "Database Error"}</p>
                <p className="text-red-600">{message}</p>
                {isNetwork && (
                    <p className="mt-1 text-red-500 text-xs">
                        Make sure <code className="font-mono bg-red-100 px-1 rounded">firestore.googleapis.com</code> is reachable.
                    </p>
                )}
                {!isNetwork && message?.includes("permission") && (
                    <p className="mt-1 text-red-500 text-xs">
                        Go to Firebase Console → Firestore → Rules and set{" "}
                        <code className="font-mono bg-red-100 px-1 rounded">allow read, write: if true;</code> for development.
                    </p>
                )}
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 text-lg leading-none">×</button>
            )}
        </div>
    );
}

// ─── Tier Row ─────────────────────────────────────────────────────────────────

function TierRow({ tier, currency, onChange, onRemove, isFixed }) {
    const sym = CURRENCIES.find(c => c.code === currency)?.symbol || currency;
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tier.color }} />
            {isFixed ? (
                <span className="w-24 text-sm font-semibold text-gray-700 flex-shrink-0">{tier.label}</span>
            ) : (
                <input type="text" value={tier.label} onChange={e => onChange({ ...tier, label: e.target.value })}
                    placeholder="Tier name"
                    className="w-24 flex-shrink-0 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-emerald-400 bg-white" />
            )}
            <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 pointer-events-none">{sym}</span>
                <input type="number" min="0" value={tier.price} onChange={e => onChange({ ...tier, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-700 outline-none focus:border-emerald-400 bg-white" />
            </div>
            <div className="w-28">
                <input type="number" min="0" value={tier.capacity} onChange={e => onChange({ ...tier, capacity: e.target.value })}
                    placeholder="Seats"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-emerald-400 bg-white" />
            </div>
            {!isFixed && (
                <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <TrashIcon />
                </button>
            )}
        </div>
    );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteConfirmModal({ event, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <TrashIcon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Event</h3>
                </div>
                <p className="text-gray-600 mb-2">
                    Are you sure you want to delete "<span className="font-semibold">{event?.title}</span>"?
                </p>
                <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onCancel}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Event Card with Edit/Delete Menu ─────────────────────────────────────────

function EventCard({ event, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const displayDate = event.date
        ? typeof event.date === "string" && event.date.includes("at")
            ? event.date
            : `${event.date}${event.time ? " at " + event.time : ""}`
        : "Date TBD";

    useEffect(() => {
        const handleClickOutside = () => setMenuOpen(false);
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [menuOpen]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
            <div className="relative h-52 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#ecfdf5" }}>
                <span className="absolute top-3 left-3 z-10 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#d1fae5", color: "#059669" }}>
                    {event.status ?? "Upcoming"}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-colors"
                >
                    <MoreVerticalIcon />
                </button>

                {menuOpen && (
                    <div className="absolute top-12 right-3 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[140px]">
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(event); }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <EditIcon /> Edit Event
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(event); }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                            <TrashIcon /> Delete Event
                        </button>
                    </div>
                )}

                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <span style={{ color: "#6ee7b7" }}><ImagePlaceholderIcon size="md" /></span>
                )}
            </div>
            <div className="p-5 flex flex-col gap-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <span style={{ color: "#059669" }}><CalendarIcon /></span>
                        {displayDate}
                    </div>
                    <div className="flex items-center gap-2">
                        <span style={{ color: "#059669" }}><LocationIcon /></span>
                        {event.location ?? "Location TBD"}
                    </div>
                    <div className="flex items-center gap-2">
                        <span style={{ color: "#059669" }}><UsersIcon /></span>
                        {event.booked ?? `0 / ${event.totalCapacity ?? "∞"} booked`}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── All Events View ──────────────────────────────────────────────────────────

function AllEventsView({ events, onNavigateToCreate, onEditEvent, onDeleteEvent, dbError, isNetworkError, onDismissError }) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All Status");

    const filtered = events.filter(e =>
        e.title?.toLowerCase().includes(search.toLowerCase()) &&
        (status === "All Status" || e.status === status)
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor your events</p>
                </div>
            </div>

            {dbError && (
                <ErrorBanner message={dbError} isNetwork={isNetworkError} onDismiss={onDismissError} />
            )}

            <div className="flex gap-3 mb-6">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <SearchIcon />
                    <input type="text" placeholder="Search events..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400" />
                </div>
                <div className="relative">
                    <select value={status} onChange={e => setStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 pr-9 py-2.5 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
                        <option>All Status</option>
                        <option>Upcoming</option>
                        <option>Ongoing</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                    <ImagePlaceholderIcon size="lg" />
                    <p className="mt-3 text-sm">No events found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={onEditEvent}
                            onDelete={onDeleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Create/Edit Event View ────────────────────────────────────────────────────────

function CreateEditEventView({ onBack, onSaved, editingEvent }) {
    const isEditing = !!editingEvent;

    const [form, setForm] = useState({
        title: editingEvent?.title || "",
        description: editingEvent?.description || "",
        date: editingEvent?.date?.split(" at ")[0] || "",
        time: editingEvent?.time || (editingEvent?.date?.includes("at") ? editingEvent.date.split(" at ")[1] : ""),
        location: editingEvent?.location || "",
        totalCapacity: editingEvent?.totalCapacity || "",
        status: editingEvent?.status || "Upcoming",
    });

    const [bookingMode, setBookingMode] = useState(() => {
        if (editingEvent?.pricing) {
            if (editingEvent.pricing.mode === "classified") return "classified";
            if (editingEvent.pricing.mode === "packages") return "packages";
            return "none";
        }
        return "none";
    });

    const [currency, setCurrency] = useState(editingEvent?.pricing?.currency || "ZAR");
    const [tiers, setTiers] = useState(() => {
        if (editingEvent?.pricing?.tiers) {
            return editingEvent.pricing.tiers;
        }
        return DEFAULT_TIERS.map(t => ({ ...t }));
    });

    const [packages, setPackages] = useState(() => {
        if (editingEvent?.pricing?.packages && editingEvent.pricing.packages.length > 0) {
            return editingEvent.pricing.packages;
        }
        return [{ id: Date.now(), label: "Early Bird", price: "", capacity: "", description: "" }];
    });

    const [flatPrice, setFlatPrice] = useState(editingEvent?.pricing?.price || "");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(editingEvent?.imageUrl || null);
    const [uploadPct, setUploadPct] = useState(0);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [fieldError, setFieldError] = useState("");

    const sym = CURRENCIES.find(c => c.code === currency)?.symbol || currency;

    const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleImageUpload = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setSaveError(null);
    };

    const updateTier = (id, updated) => setTiers(prev => prev.map(t => t.id === id ? updated : t));
    const addCustomTier = () => setTiers(prev => [...prev, { id: `custom_${Date.now()}`, label: "", color: "#10B981", price: "", capacity: "" }]);
    const removeTier = id => setTiers(prev => prev.filter(t => t.id !== id));

    const updatePackage = (id, field, val) => setPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
    const addPackage = () => setPackages(prev => [...prev, { id: Date.now(), label: "", price: "", capacity: "", description: "" }]);
    const removePackage = id => setPackages(prev => prev.filter(p => p.id !== id));

    const handleSubmit = async () => {
        setSaveError(null);
        setFieldError("");
        if (!form.title.trim()) { setFieldError("Event title is required."); return; }

        setSaving(true);
        setUploadPct(0);

        const pricing =
            bookingMode === "classified" ? { mode: "classified", currency, tiers } :
                bookingMode === "packages" ? { mode: "packages", currency, packages } :
                    { mode: "flat", currency, price: flatPrice };

        // The actual API call will be handled by the parent component
        onSaved({ ...form, pricing, imageFile, existingImageUrl: editingEvent?.imageUrl });
    };

    const inputClass =
        "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 " +
        "placeholder-gray-400 outline-none focus:border-emerald-400 transition-colors bg-white";

    const modeBtn = (mode, label, desc) => (
        <button key={mode} onClick={() => setBookingMode(mode)}
            className={`flex-1 text-left p-4 rounded-xl border-2 transition-all ${bookingMode === mode ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}>
            <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full border-2 ${bookingMode === mode ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`} />
                <span className={`text-sm font-semibold ${bookingMode === mode ? "text-emerald-700" : "text-gray-700"}`}>{label}</span>
            </div>
            <p className="text-xs text-gray-500 ml-5">{desc}</p>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeftIcon />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Event" : "Create New Event"}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{isEditing ? "Update your event details" : "Fill in the details for your new event"}</p>
                </div>
            </div>

            {saveError && (
                <ErrorBanner
                    message={saveError}
                    isNetwork={saveError.toLowerCase().includes("network") || saveError.toLowerCase().includes("reach")}
                    onDismiss={() => setSaveError(null)}
                />
            )}

            <div className="flex gap-5 items-start">
                {/* ── Left column ── */}
                <div className="flex-1 flex flex-col gap-5">

                    {/* Event Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900">Event Details</h2>
                        <p className="text-sm text-gray-400 mt-0.5 mb-5">Basic information about your event</p>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
                                <input type="text" placeholder="Enter event title" value={form.title}
                                    onChange={handleChange("title")}
                                    className={`${inputClass} ${fieldError ? "border-red-400" : ""}`} />
                                {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                <textarea placeholder="Describe your event..." value={form.description}
                                    onChange={handleChange("description")} rows={3}
                                    className={`${inputClass} resize-y`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                                    <input type="date" value={form.date} onChange={handleChange("date")} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                                    <input type="time" value={form.time} onChange={handleChange("time")} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                <input type="text" placeholder="Event venue or address" value={form.location}
                                    onChange={handleChange("location")} className={inputClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Capacity</label>
                                    <input type="number" placeholder="Max attendees" value={form.totalCapacity}
                                        onChange={handleChange("totalCapacity")} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                    <div className="relative">
                                        <select value={form.status} onChange={handleChange("status")}
                                            className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                                            <option>Upcoming</option>
                                            <option>Ongoing</option>
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking & Pricing */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900">Booking & Pricing</h2>
                        <p className="text-sm text-gray-400 mt-0.5 mb-5">Choose how attendees book and pay</p>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                            <div className="relative w-64">
                                <select value={currency} onChange={e => setCurrency(e.target.value)}
                                    className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-5">
                            {modeBtn("none", "Flat / Free", "Single price or free entry for all attendees")}
                            {modeBtn("packages", "Packages", "Offer named booking packages (e.g. Early Bird, Group)")}
                            {modeBtn("classified", "Classified Tiers", "General / VIP / VVIP ticket categories")}
                        </div>

                        {bookingMode === "none" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ticket Price <span className="text-gray-400 font-normal">(leave 0 for free)</span>
                                </label>
                                <div className="relative w-48">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">{sym}</span>
                                    <input type="number" min="0" value={flatPrice}
                                        onChange={e => setFlatPrice(e.target.value)}
                                        placeholder="0.00" className={`${inputClass} pl-8`} />
                                </div>
                            </div>
                        )}

                        {bookingMode === "packages" && (
                            <div className="flex flex-col gap-3">
                                {packages.map(pkg => (
                                    <div key={pkg.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3">
                                        <div className="flex gap-3 items-start">
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Package Name</label>
                                                <input type="text" placeholder="e.g. Early Bird" value={pkg.label}
                                                    onChange={e => updatePackage(pkg.id, "label", e.target.value)}
                                                    className={inputClass} />
                                            </div>
                                            <div className="w-36">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Price ({sym})</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">{sym}</span>
                                                    <input type="number" min="0" placeholder="0.00" value={pkg.price}
                                                        onChange={e => updatePackage(pkg.id, "price", e.target.value)}
                                                        className={`${inputClass} pl-8`} />
                                                </div>
                                            </div>
                                            <div className="w-28">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Seats</label>
                                                <input type="number" min="0" placeholder="∞" value={pkg.capacity}
                                                    onChange={e => updatePackage(pkg.id, "capacity", e.target.value)}
                                                    className={inputClass} />
                                            </div>
                                            {packages.length > 1 && (
                                                <button onClick={() => removePackage(pkg.id)}
                                                    className="mt-6 text-gray-400 hover:text-red-500 transition-colors">
                                                    <TrashIcon />
                                                </button>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">What's included</label>
                                            <input type="text" placeholder="e.g. Access to all stages + parking"
                                                value={pkg.description}
                                                onChange={e => updatePackage(pkg.id, "description", e.target.value)}
                                                className={inputClass} />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addPackage}
                                    className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors w-fit">
                                    <PlusIcon /> Add package
                                </button>
                            </div>
                        )}

                        {bookingMode === "classified" && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 px-3 text-xs font-medium text-gray-400">
                                    <span className="w-3" />
                                    <span className="w-24">Tier</span>
                                    <span className="flex-1">Price ({sym})</span>
                                    <span className="w-28">Seats</span>
                                    <span className="w-4" />
                                </div>
                                {tiers.map((tier, i) => (
                                    <TierRow key={tier.id} tier={tier} currency={currency}
                                        onChange={updated => updateTier(tier.id, updated)}
                                        onRemove={() => removeTier(tier.id)}
                                        isFixed={i < 3} />
                                ))}
                                <button onClick={addCustomTier}
                                    className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors w-fit">
                                    <PlusIcon /> Add custom tier
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right column ── */}
                <div className="w-80 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900">Event Image</h2>
                        <p className="text-sm text-gray-400 mt-0.5 mb-4">Uploaded to Firebase Storage — permanent across all sessions</p>

                        <label className="block cursor-pointer">
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
                            <div className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center gap-2 hover:border-emerald-300 transition-colors overflow-hidden"
                                style={{ backgroundColor: "#F9F9FB" }}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <span className="text-gray-400"><ImagePlaceholderIcon size="lg" /></span>
                                        <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                                        <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10 MB</span>
                                    </>
                                )}
                            </div>
                        </label>

                        {saving && uploadPct > 0 && uploadPct < 100 && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Uploading image…</span><span>{uploadPct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full transition-all"
                                        style={{ width: `${uploadPct}%`, backgroundColor: "#059669" }} />
                                </div>
                            </div>
                        )}

                        <label className="mt-3 flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
                            <UploadIcon /> {imageFile ? "Change Image" : "Upload Image"}
                        </label>

                        {imageFile && (
                            <p className="mt-2 text-xs text-gray-400 truncate text-center">{imageFile.name}</p>
                        )}
                    </div>

                    {(bookingMode !== "none" || flatPrice) && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Pricing Summary</h3>
                            {bookingMode === "none" && (
                                <p className="text-sm text-gray-600">
                                    Flat ticket: <span className="font-semibold text-emerald-700">{sym}{flatPrice || "0.00"}</span>
                                </p>
                            )}
                            {bookingMode === "packages" && packages.map(p => (
                                <div key={p.id} className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>{p.label || "–"}</span>
                                    <span className="font-semibold text-emerald-700">{sym}{p.price || "0.00"}</span>
                                </div>
                            ))}
                            {bookingMode === "classified" && tiers.map(t => (
                                <div key={t.id} className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: t.color }} />
                                        {t.label || "–"}
                                    </span>
                                    <span className="font-semibold text-emerald-700">{sym}{t.price || "0.00"}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={handleSubmit} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
                        style={{ backgroundColor: "#059669" }}>
                        <CalendarIcon className="w-4 h-4" />
                        {saving
                            ? uploadPct > 0 && uploadPct < 100 ? `Uploading… ${uploadPct}%` : "Saving…"
                            : isEditing ? "Update Event" : "Create Event"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function EventManagement({ initialView = "list", onBack }) {
    const [view, setView] = useState(initialView);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(null);
    const [isNetworkErr, setIsNetErr] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [deletingEvent, setDeletingEvent] = useState(null);
    const [, setSaving] = useState(false);

    useEffect(() => { setView(initialView); }, [initialView]);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedEvents = await getEvents();
            setEvents(fetchedEvents.length > 0 ? fetchedEvents : SEED_EVENTS);
            setDbError(null);
        } catch (err) {
            setDbError(err.message);
            setIsNetErr(err.message?.includes("network") || err.message?.includes("fetch"));
            setEvents(SEED_EVENTS); // Fallback to seed events
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch events on mount
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSaved = useCallback(async (eventData) => {
        setSaving(true);
        try {
            if (editingEvent) {
                // Update existing event
                await updateEvent(editingEvent.id, eventData, eventData.imageFile);
            } else {
                // Create new event
                await createEvent(eventData, eventData.imageFile);
            }
            setView("list");
            setEditingEvent(null);
            if (onBack) onBack();

            // Refresh events
            await fetchEvents();
        } catch (err) {
            setDbError(err.message);
        } finally {
            setSaving(false);
        }
    }, [editingEvent, onBack, fetchEvents]);

    const handleEdit = useCallback((event) => {
        setEditingEvent(event);
        setView("create");
    }, []);

    const handleDelete = useCallback(async () => {
        if (!deletingEvent) return;

        try {
            await deleteEvent(deletingEvent.id);
            setDeletingEvent(null);

            // Refresh events
            await fetchEvents();
        } catch (err) {
            console.error("Failed to delete event:", err);
            setDbError(err.message ?? "Failed to delete event. Please try again.");
        }
    }, [deletingEvent, fetchEvents]);

    if (view === "create") {
        return (
            <CreateEditEventView
                onBack={() => {
                    setView("list");
                    setEditingEvent(null);
                }}
                onSaved={handleSaved}
                editingEvent={editingEvent}
            />
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 font-sans animate-pulse">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                    </div>
                </div>
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="w-32 h-12 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                            <div className="h-52 bg-gray-200"></div>
                            <div className="p-5 flex flex-col gap-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="mt-2 flex flex-col gap-2">
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const displayEvents = events.length > 0 ? events : SEED_EVENTS;

    return (
        <>
            <AllEventsView
                events={displayEvents}
                onNavigateToCreate={() => {
                    setEditingEvent(null);
                    setView("create");
                }}
                onEditEvent={handleEdit}
                onDeleteEvent={setDeletingEvent}
                dbError={dbError}
                isNetworkError={isNetworkErr}
                onDismissError={() => setDbError(null)}
            />
            {deletingEvent && (
                <DeleteConfirmModal
                    event={deletingEvent}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingEvent(null)}
                />
            )}
        </>
    );
}
