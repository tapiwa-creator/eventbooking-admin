import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

export default function Layout({ currentPath, onNavigate, children, user, onLogout, pageTitle, pageSubtitle }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Header pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
      <div style={{ marginLeft: "220px", paddingTop: "60px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <main style={{ flex: 1, padding: "24px 28px" }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}