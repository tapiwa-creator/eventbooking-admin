import { useState } from "react";
import AuthService from "../Services/AuthService";

// Changed to system default sans-serif (not Inter, not bold)
const FONT = "'Inter', sans-serif";

const BRAND = "#059669";
const BRAND_LIGHT = "#F5F3FF";
const BRAND_DARK = "#064e3b";

const UserIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const EyeIcon = ({ off }) => off ? (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
) : (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

function SectionCard({ icon, title, subtitle, children }) {
    return (
        <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1px solid #f0effe",
            boxShadow: "0 2px 12px rgba(108,92,231,0.06)",
            overflow: "hidden", fontFamily: FONT,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 28px 18px", borderBottom: "1px solid #f5f3ff" }}>
                <div style={{ width: 38, height: 38, borderRadius: "10px", background: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", color: BRAND, flexShrink: 0 }}>
                    {icon}
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#18103a", fontFamily: FONT }}>{title}</p>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#9ca3af", marginTop: "1px", fontFamily: FONT }}>{subtitle}</p>
                </div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>{children}</div>
        </div>
    );
}

function Field({ label, type = "text", value, onChange, error, placeholder, rightEl, readOnly }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#374151", marginBottom: "6px", fontFamily: FONT }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <input
                    type={type} value={value} placeholder={placeholder} readOnly={readOnly}
                    onChange={e => onChange && onChange(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{
                        width: "100%", boxSizing: "border-box",
                        padding: rightEl ? "11px 42px 11px 14px" : "11px 14px",
                        border: `1.5px solid ${error ? "#fca5a5" : focused ? BRAND : "#e5e7eb"}`,
                        borderRadius: "9px", fontSize: "14px",
                        color: readOnly ? "#9ca3af" : "#18103a",
                        background: readOnly ? "#f9fafb" : error ? "#fff5f5" : "#fff",
                        outline: "none", fontFamily: FONT,
                        boxShadow: focused && !readOnly ? `0 0 0 3px rgba(108,92,231,0.12)` : "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                        cursor: readOnly ? "default" : "text",
                    }}
                />
                {rightEl && <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)" }}>{rightEl}</div>}
            </div>
            {error && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444", fontFamily: FONT }}>{error}</p>}
        </div>
    );
}

function SaveBtn({ onClick, loading, children }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} disabled={loading}
            onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
            style={{
                padding: "10px 24px",
                background: loading ? "#c4b5fd" : hov ? BRAND_DARK : BRAND,
                color: "#fff", border: "none", borderRadius: "9px",
                fontSize: "13.5px", fontWeight: 700, fontFamily: FONT,
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex", alignItems: "center", gap: "7px",
                transition: "background 0.15s",
            }}>
            {loading ? (<><span style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Saving…</>) : children}
        </button>
    );
}

function Toast({ message, type }) {
    return (
        <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, fontFamily: FONT,
            background: type === "success" ? "#d1fae5" : "#fee2e2",
            color: type === "success" ? "#059669" : "#dc2626",
        }}>
            {type === "success" ? <CheckIcon /> : "✕"}{message}
        </div>
    );
}

function ProfileSection({ user, onUserUpdate }) {
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); }

    async function handleSave() {
        const errs = {};
        if (!firstName || firstName.trim().length < 2) errs.firstName = "At least 2 characters required.";
        if (!lastName || lastName.trim().length < 2) errs.lastName = "At least 2 characters required.";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        const result = await AuthService.updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
        setLoading(false);
        if (result.success) { setErrors({}); if (onUserUpdate) onUserUpdate(result.user); showToast("Profile updated successfully."); }
        else { showToast(result.error || "Failed to update.", "error"); }
    }

    return (
        <SectionCard icon={<UserIcon />} title="Profile" subtitle="Update your display name">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Field label="First Name" value={firstName} onChange={setFirstName} error={errors.firstName} placeholder="John" />
                <Field label="Last Name" value={lastName} onChange={setLastName} error={errors.lastName} placeholder="Doe" />
            </div>
            <Field label="Email" value={user?.email || ""} readOnly />
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <SaveBtn onClick={handleSave} loading={loading}><CheckIcon /> Save Changes</SaveBtn>
                {toast && <Toast message={toast.msg} type={toast.type} />}
            </div>
        </SectionCard>
    );
}

function EmailSection({ user, onUserUpdate }) {
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); }

    async function handleSave() {
        const errs = {};
        if (!newEmail || !newEmail.includes("@")) errs.email = "Enter a valid email address.";
        if (newEmail.toLowerCase().trim() === user?.email) errs.email = "This is already your current email.";
        if (!password || password.length < 6) errs.password = "Enter your current password to confirm.";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        const result = await AuthService.changeEmail(user.email, password, newEmail.toLowerCase().trim());
        setLoading(false);
        if (result.success) { 
            if (onUserUpdate) onUserUpdate(result.user); 
            setNewEmail(""); 
            setPassword(""); 
            setErrors({}); 
            showToast("Email updated successfully."); 
        } else { 
            if (result.error.toLowerCase().includes("password") || result.error.toLowerCase().includes("credential")) {
                setErrors({ password: result.error });
            } else {
                setErrors({ email: result.error });
            }
        }
    }

    return (
        <SectionCard icon={<MailIcon />} title="Change Email" subtitle="Update the email address on your account">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Field label="New Email Address" type="email" value={newEmail} onChange={setNewEmail} error={errors.email} placeholder="new@example.com" />
                <Field label="Current Password (to confirm)" type="password" value={password} onChange={setPassword} error={errors.password} placeholder="Enter your password" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <SaveBtn onClick={handleSave} loading={loading}><CheckIcon /> Update Email</SaveBtn>
                {toast && <Toast message={toast.msg} type={toast.type} />}
            </div>
        </SectionCard>
    );
}

function PasswordSection({ user }) {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); }

    const strength = (() => { if (!next) return 0; let s = 0; if (next.length >= 8) s++; if (/[A-Z]/.test(next)) s++; if (/[0-9]/.test(next)) s++; if (/[^A-Za-z0-9]/.test(next)) s++; return s; })();
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"][strength];

    async function handleSave() {
        const errs = {};
        if (!current || current.length < 6) errs.current = "Enter your current password.";
        if (!next || next.length < 6) errs.next = "New password must be at least 6 characters.";
        if (next === current) errs.next = "New password must differ from current.";
        if (next !== confirm) errs.confirm = "Passwords do not match.";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        const result = await AuthService.changePassword(user.email, current, next);
        setLoading(false);
        if (result.success) {
            setCurrent(""); setNext(""); setConfirm(""); setErrors({});
            showToast("Password changed successfully.");
        } else {
            setErrors({ current: result.error });
        }
    }

    return (
        <SectionCard icon={<LockIcon />} title="Change Password" subtitle="Keep your account secure with a strong password">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <Field label="Current Password" type={showCurrent ? "text" : "password"} value={current} onChange={setCurrent} error={errors.current} placeholder="Current password"
                    rightEl={<button onClick={() => setShowCurrent(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}><EyeIcon off={showCurrent} /></button>} />
                <Field label="New Password" type={showNext ? "text" : "password"} value={next} onChange={setNext} error={errors.next} placeholder="Min. 6 characters"
                    rightEl={<button onClick={() => setShowNext(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}><EyeIcon off={showNext} /></button>} />
                <Field label="Confirm New Password" type="password" value={confirm} onChange={setConfirm} error={errors.confirm} placeholder="Repeat new password" />
            </div>
            {next.length > 0 && (
                <div style={{ marginTop: "-6px", marginBottom: "18px" }}>
                    <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                        {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: "2px", background: i <= strength ? strengthColor : "#e5e7eb", transition: "background 0.2s" }} />)}
                    </div>
                    <p style={{ margin: 0, fontSize: "11.5px", fontWeight: 600, color: strengthColor, fontFamily: FONT }}>Password strength: {strengthLabel}</p>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <SaveBtn onClick={handleSave} loading={loading}><CheckIcon /> Change Password</SaveBtn>
                {toast && <Toast message={toast.msg} type={toast.type} />}
            </div>
        </SectionCard>
    );
}

export default function Settings({ user, onUserUpdate }) {
    const currentUser = user || AuthService.getCurrentUser();
    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
            <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: FONT }}>
                <div style={{ marginBottom: "28px" }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800, color: "#18103a", fontFamily: FONT }}>Account Settings</h1>
                    <p style={{ margin: 0, fontSize: "13.5px", color: "#9ca3af", fontFamily: FONT }}>Manage your profile, email, and password</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ProfileSection user={currentUser} onUserUpdate={onUserUpdate} />
                    <EmailSection user={currentUser} onUserUpdate={onUserUpdate} />
                    <PasswordSection user={currentUser} />
                </div>
            </div>
        </>
    );
}
