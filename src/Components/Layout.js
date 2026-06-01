import { useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

export default function Layout({ currentPath, onNavigate, children, user, onLogout, pageTitle, pageSubtitle }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar currentPath={currentPath} onNavigate={(path) => { setIsMobileMenuOpen(false); onNavigate(path); }} user={user} onLogout={onLogout} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Header pageTitle={pageTitle} pageSubtitle={pageSubtitle} user={user} onMenuClick={() => setIsMobileMenuOpen(true)} />
      <div className="md:ml-[230px] pt-[64px] flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 lg:p-7">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
