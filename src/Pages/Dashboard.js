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

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(null);
    const [isNetworkErr, setIsNetErr] = useState(false);

    // Subscribe to real-time events and bookings
    useEffect(() => {
        let unsubscribeEvents;
        let unsubscribeBookings;

        const setupSubscriptions = async () => {
            try {
                setLoading(true);

                // Subscribe to events
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

                // Subscribe to bookings
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

    // Calculate statistics from real events and bookings
    const calculateStats = () => {
        const totalEvents = events.length;
        const upcomingEvents = events.filter(e => e.status === "Upcoming").length;

        // Calculate total tickets sold from bookings (sum of quantities)
        const totalTicketsSold = bookings.reduce((sum, booking) => {
            // Only count confirmed bookings
            if (booking.status === "confirmed" || booking.status === "Confirmed") {
                return sum + (booking.quantity || 0);
            }
            return sum;
        }, 0);

        // Calculate total booking value (revenue) - USD only
        const totalRevenue = bookings.reduce((sum, booking) => {
            if (booking.status === "confirmed" || booking.status === "Confirmed") {
                return sum + (booking.totalAmount || 0);
            }
            return sum;
        }, 0);

        // Calculate total unique attendees (based on email)
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

    // Format recent events with real booking data from bookings collection
    const getRecentEvents = () => {
        // Get upcoming events sorted by date
        const upcomingEventsList = events
            .filter(e => e.status === "Upcoming")
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            })
            .slice(0, 5);

        return upcomingEventsList.map(event => {
            // Format the date for display
            let formattedDate = event.date;
            if (event.date && event.time) {
                formattedDate = `${event.date} at ${event.time}`;
            } else if (event.date) {
                formattedDate = event.date;
            } else {
                formattedDate = "Date TBD";
            }

            // Get real bookings count for this event from bookings collection
            const eventBookings = bookings.filter(b =>
                b.eventId === event.id &&
                (b.status === "confirmed" || b.status === "Confirmed")
            );

            const totalBookingsForEvent = eventBookings.reduce((sum, b) => sum + (b.quantity || 0), 0);

            // Get capacity
            let capacityText = event.totalCapacity || "∞";

            return {
                id: event.id,
                name: event.title,
                date: formattedDate,
                bookings: totalBookingsForEvent,
                capacity: `${totalBookingsForEvent} / ${capacityText}`,
                revenue: eventBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
            };
        });
    };

    // Get recent bookings for display
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
            icon: <CalendarIcon />
        },
        {
            label: "Total Registrations",
            value: calculateStats().totalTicketsSold,
            sub: "Across all programmes",
            icon: <TicketIcon />
        },
        {
            label: "Total Attendees",
            value: calculateStats().uniqueAttendees,
            sub: "Unique attendees",
            icon: <UsersIcon />
        },
        {
            label: "Total Reg Fee",
            value: `$${calculateStats().totalRevenue.toFixed(2)}`,
            sub: "Total revenue from bookings",
            icon: <TrendingUpIcon />
        },
    ];

    const recentEvents = getRecentEvents();
    const recentBookings = getRecentBookings();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "#059669", borderTopColor: "transparent" }} />
                    <p className="text-sm text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Page Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your events and bookings.</p>
                </div>
            </div>

            {/* Error Banner */}
            {dbError && (
                <ErrorBanner
                    message={dbError}
                    isNetwork={isNetworkErr}
                    onDismiss={() => setDbError(null)}
                />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                            <span style={{ color: "#059669" }}>{stat.icon}</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
                {/* Recent Events Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
                            {recentEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-150"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: "#d1fae5" }}
                                        >
                                            <span style={{ color: "#059669" }}>
                                                <CalendarIcon className="w-5 h-5" />
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">{event.name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{event.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-800">{event.bookings} tickets</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{event.capacity} capacity</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Bookings Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-150"
                                >
                                    <div>
                                        <div className="text-sm font-semibold text-gray-800">{booking.attendeeName}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{booking.eventTitle}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-800">
                                            {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                                        </div>
                                        <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                                            {booking.currency}{booking.totalAmount}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}