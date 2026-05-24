import { useState, useEffect } from "react";
import { subscribeToEvents } from "../Services/CreateEventServices";
import { subscribeToBookings } from "../Services/BookingsServices";

const CalendarIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CalendarOutlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);

const TicketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
);

// Error Banner Component
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
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 text-lg leading-none">×</button>
            )}
        </div>
    );
}

const avatarColors = [
    { bg: '#dcfce7', text: '#15803d' },
    { bg: '#ccfbf1', text: '#0f766e' },
    { bg: '#dbeafe', text: '#1d4ed8' },
    { bg: '#fef3c7', text: '#b45309' },
];

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(null);
    const [isNetworkErr, setIsNetErr] = useState(false);

    useEffect(() => {
        let unsubscribeEvents;
        let unsubscribeBookings;

        const setupSubscriptions = async () => {
            try {
                setLoading(true);

                unsubscribeEvents = subscribeToEvents(
                    (data) => {
                        setEvents(data);
                        setLoading(false);
                        setDbError(null);
                    },
                    (error) => {
                        console.error("Firestore events error:", error);
                        const isNetwork = error.message?.includes("network") || error.message?.includes("unavailable");
                        setDbError(error.message);
                        setIsNetErr(isNetwork);
                        setLoading(false);
                    }
                );

                unsubscribeBookings = subscribeToBookings(
                    (data) => {
                        setBookings(data);
                    },
                    (error) => {
                        console.error("Firestore bookings error:", error);
                    }
                );

            } catch (err) {
                console.error("Failed to setup subscriptions:", err);
                setDbError("Could not connect to the database. Please check your connection.");
                setIsNetErr(true);
                setLoading(false);
            }
        };

        setupSubscriptions();

        return () => {
            if (unsubscribeEvents && typeof unsubscribeEvents === 'function') {
                unsubscribeEvents();
            }
            if (unsubscribeBookings && typeof unsubscribeBookings === 'function') {
                unsubscribeBookings();
            }
        };
    }, []);

    const calculateStats = () => {
        const totalEvents = events.length;
        const upcomingEvents = events.filter(e => e.status === "Upcoming").length;

        const totalTicketsSold = bookings.reduce((sum, booking) => {
            if (booking.status === "confirmed" || booking.status === "Confirmed") {
                return sum + (booking.quantity || 0);
            }
            return sum;
        }, 0);

        const totalRevenue = bookings.reduce((sum, booking) => {
            if (booking.status === "confirmed" || booking.status === "Confirmed") {
                return sum + (booking.totalAmount || 0);
            }
            return sum;
        }, 0);

        const uniqueAttendees = new Set();
        bookings.forEach(booking => {
            if (booking.status === "confirmed" || booking.status === "Confirmed") {
                if (booking.attendeeEmail) {
                    uniqueAttendees.add(booking.attendeeEmail);
                }
            }
        });

        return {
            totalEvents,
            upcomingEvents,
            totalTicketsSold,
            totalRevenue,
            uniqueAttendees: uniqueAttendees.size
        };
    };

    const getRecentEvents = () => {
        const upcomingEventsList = events
            .filter(e => e.status === "Upcoming")
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            })
            .slice(0, 5);

        return upcomingEventsList.map(event => {
            let formattedDate = event.date;
            if (event.date && event.time) {
                formattedDate = `${event.date} at ${event.time}`;
            } else if (event.date) {
                formattedDate = event.date;
            } else {
                formattedDate = "Date TBD";
            }

            const eventBookings = bookings.filter(b =>
                b.eventId === event.id &&
                (b.status === "confirmed" || b.status === "Confirmed")
            );

            const totalBookingsForEvent = eventBookings.reduce((sum, b) => sum + (b.quantity || 0), 0);
            const capacityNum = parseInt(event.totalCapacity) || 0;

            return {
                id: event.id,
                name: event.title,
                date: formattedDate,
                bookings: totalBookingsForEvent,
                capacityNum: capacityNum,
                capacity: capacityNum > 0 ? `${totalBookingsForEvent} / ${capacityNum} capacity` : `${totalBookingsForEvent} / ∞ capacity`,
            };
        });
    };

    const getRecentBookings = () => {
        return bookings
            .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
            .slice(0, 5)
            .map(booking => ({
                id: booking.id,
                attendeeName: booking.attendeeName,
                eventTitle: booking.eventTitle,
                quantity: booking.quantity,
                totalAmount: booking.totalAmount,
                currency: booking.currency || "$",
                status: booking.status,
                date: booking.bookingDate
            }));
    };

    const stats = [
        {
            label: "Total Programmes",
            value: calculateStats().totalEvents,
            sub: `${calculateStats().upcomingEvents} upcoming`,
            icon: <CalendarIcon />,
            color: "#4ab360",
            bgColor: "#f0faf4"
        },
        {
            label: "Total Registrations",
            value: calculateStats().totalTicketsSold,
            sub: "Across all programmes",
            icon: <TicketIcon />,
            color: "#0d9488",
            bgColor: "#ccfbf1"
        },
        {
            label: "Total Attendees",
            value: calculateStats().uniqueAttendees,
            sub: "Unique attendees",
            icon: <UsersIcon />,
            color: "#2563eb",
            bgColor: "#dbeafe"
        },
        {
            label: "Total Reg Fee",
            value: `$${calculateStats().totalRevenue.toFixed(2)}`,
            sub: "Total revenue from bookings",
            icon: <TrendingUpIcon />,
            color: "#d97706",
            bgColor: "#fef3c7"
        },
    ];

    const recentEvents = getRecentEvents();
    const recentBookings = getRecentBookings();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "#4ab360", borderTopColor: "transparent" }} />
                    <p className="text-sm text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your events and bookings.</p>
                </div>
            </div>

            {dbError && (
                <ErrorBanner
                    message={dbError}
                    isNetwork={isNetworkErr}
                    onDismiss={() => setDbError(null)}
                />
            )}

            <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white relative overflow-hidden" style={{ borderRadius: "12px", border: "0.5px solid var(--color-border-tertiary)", padding: "20px" }}>
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: stat.color }} />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                            <div className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: stat.bgColor, color: stat.color, borderRadius: "10px" }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white shadow-none" style={{ borderRadius: "12px", border: "0.5px solid var(--color-border-tertiary)", padding: "24px" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-900">Upcoming Events</h2>
                    </div>

                    {recentEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <CalendarIcon className="w-12 h-12 mb-3" />
                            <p className="text-sm">No upcoming events found</p>
                            <p className="text-xs mt-1">Create your first event to see it here</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentEvents.map((event) => {
                                const percent = event.capacityNum > 0 ? (event.bookings / event.capacityNum) * 100 : 0;
                                return (
                                    <div
                                        key={event.id}
                                        className="p-4 transition-all duration-150"
                                        style={{ borderRadius: "12px", border: "0.5px solid var(--color-border-tertiary)" }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: "#f0faf4", borderRadius: "10px", color: "#4ab360" }}
                                                >
                                                    <CalendarIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-800">{event.name}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">{event.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-800">{event.bookings} tickets</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{event.capacity}</div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                                            <div className="bg-[#4ab360] h-1 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-white shadow-none" style={{ borderRadius: "12px", border: "0.5px solid var(--color-border-tertiary)", padding: "24px" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-900">Recent Bookings</h2>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <TicketIcon />
                            <p className="text-sm mt-3">No bookings yet</p>
                            <p className="text-xs mt-1">Bookings will appear here once attendees confirm their tickets</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentBookings.map((booking, idx) => {
                                const initials = booking.attendeeName ? booking.attendeeName.substring(0, 2).toUpperCase() : "U";
                                const avatarTheme = avatarColors[idx % avatarColors.length];
                                return (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 transition-all duration-150"
                                        style={{ borderRadius: "12px", border: "0.5px solid var(--color-border-tertiary)" }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                                                style={{ backgroundColor: avatarTheme.bg, color: avatarTheme.text }}
                                            >
                                                {initials}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800">{booking.attendeeName}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{booking.eventTitle}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-800">
                                                {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                                            </div>
                                            <div className="text-xs font-semibold mt-0.5" style={{ color: "#4ab360" }}>
                                                {booking.currency}{booking.totalAmount}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}