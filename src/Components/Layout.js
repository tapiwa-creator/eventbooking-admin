import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

export default function Layout({ currentPath, onNavigate, children, user, onLogout, pageTitle, pageSubtitle }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Header pageTitle={pageTitle} pageSubtitle={pageSubtitle} user={user} />
      <div style={{ marginLeft: "230px", paddingTop: "64px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <main style={{ flex: 1, padding: "24px 28px" }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
