import { useState } from "react";
import AuthService from "../Services/AuthService";

const FONT = "'Inter', sans-serif";
const DISPLAY_FONT = "'Playfair Display', serif";
const GREEN = "#14532d";
const GREEN_MID = "#166534";
const GREEN_LIGHT = "#15803d";

function EyeIcon({ off }) {
    return off ? (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    ) : (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function InputField({ label, type = "text", value, onChange, error, placeholder, name, id, autoComplete }) {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const showToggle = type === "password";
    const resolvedType = showToggle ? (visible ? "text" : "password") : type;
    return (
        <div>
            {label && (
                <div style={{ marginBottom: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                </div>
            )}
            <div style={{ position: "relative" }}>
                <input
                    type={resolvedType}
                    name={name}
                    id={id}
                    autoComplete={autoComplete}
                    value={value}
                    placeholder={placeholder}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: showToggle ? "12px 42px 12px 16px" : "12px 16px",
                        border: `1.5px solid ${error ? "#fca5a5" : focused ? GREEN_LIGHT : "#e5e7eb"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "#111827",
                        fontFamily: FONT,
                        background: error ? "#fff5f5" : focused ? "#f0fdf4" : "#f9fafb",
                        outline: "none",
                        boxShadow: focused ? `0 0 0 3px rgba(20,83,45,0.1)` : "none",
                        transition: "all 0.15s",
                    }}
                />
                {showToggle && (
                    <button type="button" onClick={() => setVisible(v => !v)}
                        style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                        <EyeIcon off={visible} />
                    </button>
                )}
            </div>
            {error && <p style={{ color: "#ef4444", fontSize: "11px", margin: "4px 0 0", fontFamily: FONT }}>{error}</p>}
        </div>
    );
}

export default function LoginPage({ onAuth }) {
    const [tab, setTab] = useState("signin");
    const [siEmail, setSiEmail] = useState("");
    const [siPass, setSiPass] = useState("");
    const [siErrors, setSiErrors] = useState({});
    const [regFirst, setRegFirst] = useState("");
    const [regLast, setRegLast] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPass, setRegPass] = useState("");
    const [regConfirm, setRegConfirm] = useState("");
    const [regErrors, setRegErrors] = useState({});
    const [regDone, setRegDone] = useState(false);

    async function handleSignIn(e) {
        if (e) e.preventDefault();
        const errs = {};
        if (!siEmail || !siEmail.includes("@")) errs.email = "Please enter a valid email.";
        if (!siPass) {
            errs.pass = "Please enter your password.";
        } else if (siPass.length < 6) {
            errs.pass = "Min. 6 characters.";
        }
        if (Object.keys(errs).length) { setSiErrors(errs); return; }
        const result = await AuthService.signIn({ email: siEmail, password: siPass });
        if (!result.success) { setSiErrors({ email: result.error }); return; }
        setSiErrors({});
        if (onAuth) onAuth(result.user);
    }

    async function handleRegister(e) {
        if (e) e.preventDefault();
        const errs = {};
        if (!regFirst || regFirst.length < 2) errs.first = "Required.";
        if (!regLast || regLast.length < 2) errs.last = "Required.";
        if (!regEmail || !regEmail.includes("@")) errs.email = "Please enter a valid email.";
        if (!regPass) {
            errs.pass = "Please enter a password.";
        } else if (regPass.length < 6) {
            errs.pass = "Min. 6 characters.";
        }
        if (regPass && regPass !== regConfirm) errs.confirm = "Passwords do not match.";
        if (Object.keys(errs).length) { setRegErrors(errs); return; }
        const result = await AuthService.register({ firstName: regFirst, lastName: regLast, email: regEmail, password: regPass });
        if (!result.success) { setRegErrors({ email: result.error }); return; }
        setRegErrors({});
        setRegDone(true);
    }

    if (regDone) return (
        <div style={pageStyle}>
            <div style={wrapperStyle}>
                <div style={leftPanelStyle}>
                    <PanelContent
                        title="Account Created!"
                        subtitle="You're all set. Sign in to start publishing programmes and managing registrations on AdventSphere."
                    />
                </div>
                <div style={rightPanelStyle}>
                    <div style={formContainerStyle}>
                        <BrandMark />
                        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", margin: "0 0 8px", fontFamily: DISPLAY_FONT }}>You're In!</h2>
                            <p style={{ fontSize: "13.5px", color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7, fontFamily: FONT }}>Your AdventSphere account is ready. Continue to sign in and start managing your programmes.</p>
                            <PrimaryBtn onClick={() => { setTab("signin"); setRegDone(false); }}>Continue to Sign In →</PrimaryBtn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={wrapperStyle}>

                {/* ── Left decorative panel ── */}
                <div style={leftPanelStyle}>
                    {tab === "signin" ? (
                        <PanelContent
                            title="Welcome Back!"
                            subtitle="Sign in to continue managing your programmes, publishing events, and handling registrations on AdventSphere."
                        />
                    ) : (
                        <PanelContent
                            title="Hello, Admin!"
                            subtitle="Create your AdventSphere account and start publishing programmes, managing registrations, and reaching your audience."
                        />
                    )}
                </div>

                {/* ── Right form panel ── */}
                <div style={rightPanelStyle}>
                    <div style={formContainerStyle}>
                        <BrandMark />

                        {tab === "signin" ? (
                            <>
                                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                                    <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#111827", margin: "0 0 6px", fontFamily: DISPLAY_FONT }}>Sign In</h1>
                                    <p style={{ fontSize: "13.5px", color: "#9ca3af", margin: 0, fontFamily: FONT }}>Access your AdventSphere admin portal</p>
                                </div>
                                <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <InputField placeholder="Email address" type="email" value={siEmail} onChange={setSiEmail} error={siErrors.email} name="email" autoComplete="email" />
                                    <InputField placeholder="Password" type="password" value={siPass} onChange={setSiPass} error={siErrors.pass} name="password" autoComplete="current-password" />
                                    <PrimaryBtn type="submit"><StarIcon /> Sign In</PrimaryBtn>
                                </form>
                                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af", fontFamily: FONT }}>
                                    Don't have an account?{" "}
                                    <button onClick={() => setTab("register")} style={{ color: GREEN_LIGHT, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: FONT, padding: 0 }}>Create one</button>
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                                    <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#111827", margin: "0 0 6px", fontFamily: DISPLAY_FONT }}>Create Account</h1>
                                    <p style={{ fontSize: "13.5px", color: "#9ca3af", margin: 0, fontFamily: FONT }}>Join AdventSphere and publish your first programme</p>
                                </div>
                                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                        <InputField placeholder="First name" value={regFirst} onChange={setRegFirst} error={regErrors.first} name="firstName" autoComplete="given-name" />
                                        <InputField placeholder="Last name" value={regLast} onChange={setRegLast} error={regErrors.last} name="lastName" autoComplete="family-name" />
                                    </div>
                                    <InputField placeholder="Email address" type="email" value={regEmail} onChange={setRegEmail} error={regErrors.email} name="email" autoComplete="email" />
                                    <InputField placeholder="Password" type="password" value={regPass} onChange={setRegPass} error={regErrors.pass} name="password" autoComplete="new-password" />
                                    <InputField placeholder="Confirm password" type="password" value={regConfirm} onChange={setRegConfirm} error={regErrors.confirm} name="confirmPassword" autoComplete="new-password" />
                                    <PrimaryBtn type="submit"><UserPlusIcon /> Create Account</PrimaryBtn>
                                    <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9ca3af", margin: 0, fontFamily: FONT }}>
                                        By signing up you agree to our{" "}
                                        <a href="#" style={{ color: GREEN_LIGHT, fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
                                    </p>
                                </form>
                                <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#9ca3af", fontFamily: FONT }}>
                                    Already have an account?{" "}
                                    <button onClick={() => setTab("signin")} style={{ color: GREEN_LIGHT, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: FONT, padding: 0 }}>Sign in</button>
                                </p>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

/* ── Sub-components ── */

function PanelContent({ title, subtitle }) {
    return (
        <>
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(160deg, rgba(20,83,45,0.82) 0%, rgba(21,128,61,0.75) 100%)",
                zIndex: 0,
            }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 36px", textAlign: "center" }}>
                <img
                    src="/sda.png"
                    alt="AdventSphere Logo"
                    style={{ width: 80, height: 80, objectFit: "contain", marginBottom: "24px", filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.35))" }}
                />
                <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: "30px", fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>{title}</h2>
                <p style={{ fontFamily: FONT, fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.75, margin: 0, maxWidth: 260 }}>{subtitle}</p>
            </div>
        </>
    );
}

function BrandMark() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
            <img src="/sda.png" alt="AdventSphere" style={{ width: 40, height: 40, objectFit: "contain" }} />
            <span style={{ fontFamily: DISPLAY_FONT, fontSize: "17px", fontWeight: 700, color: GREEN, letterSpacing: "-0.01em" }}>AdventSphere</span>
        </div>
    );
}

function PrimaryBtn({ onClick, children, type = "button" }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button type={type} onClick={onClick} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}
            style={{
                width: "100%", padding: "13px", border: "none", borderRadius: "10px",
                background: hovered ? GREEN_MID : GREEN,
                color: "#fff",
                fontSize: "14.5px", fontWeight: 700, fontFamily: FONT,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background 0.2s",
                letterSpacing: "0.01em",
            }}>
            {children}
        </button>
    );
}

function StarIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" /></svg>;
}

function UserPlusIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>;
}

/* ── Styles ── */

const pageStyle = {
    minHeight: "100vh",
    background: "#f1f5f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: FONT,
};

const wrapperStyle = {
    display: "flex",
    width: "100%",
    maxWidth: "880px",
    minHeight: "640px",
    borderRadius: "24px",
    overflow: "hidden",
};

const leftPanelStyle = {
    flex: "0 0 360px",
    backgroundImage: `url('/login.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const rightPanelStyle = {
    flex: 1,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
};

const formContainerStyle = {
    width: "100%",
    maxWidth: "360px",
};