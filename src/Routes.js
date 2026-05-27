import { useState, useEffect } from "react";
import AuthService from "./Services/AuthService";

// ─── Pages ────────────────────────────────────────────────────────────────────
import Auth from "./Pages/Auth";
import Dashboard from "./Pages/Dashboard";
import EventsPage from "./Pages/EventManagement";
import Bookings from "./Pages/Bookings";
import Settings from "./Pages/Settings";

// ─── Layout ───────────────────────────────────────────────────────────────────
import Layout from './Components/Layout'
import AddEvent from "./Pages/AddEvent";

export default function Routes() {
    const [user, setUser] = useState(() => AuthService.getCurrentUser());
    const [currentPath, setCurrentPath] = useState("/dashboard");

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 10);
    }, [currentPath]);

    const handleAuth = (userData) => {
        setUser(userData);
        setCurrentPath("/dashboard");
    };

    const handleLogout = async () => {
        await AuthService.signOut();
        setUser(null);
        setCurrentPath("/dashboard");
    };

    if (!user) {
        return <Auth onAuth={handleAuth} />;
    }

    const renderPage = () => {
        switch (currentPath) {
            case "/dashboard":
                return <Dashboard />;

            case "/events":
                return <EventsPage initialView="list" />;

            case "/bookings":
                return <Bookings />;

            case "/add-event":
                return <AddEvent />;

            case "/settings":
                return <Settings />;

            default:
                return <Dashboard />;
        }
    };

    return (
        <Layout
            currentPath={currentPath}
            onNavigate={setCurrentPath}
            user={user}
            onLogout={handleLogout}
        >
            {renderPage()}
        </Layout>
    );
}
