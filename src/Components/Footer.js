import { useState } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.523 5.847L.057 23.5l5.797-1.522A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.027-1.381l-.36-.214-3.44.903.918-3.352-.235-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

// ─── Footer Data ──────────────────────────────────────────────────────────────

const socials = [
    { label: "WhatsApp", icon: <WhatsAppIcon />, href: "#" },
    { label: "X",        icon: <XIcon />,        href: "#" },
    { label: "Instagram",icon: <InstagramIcon />,href: "#" },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, children, onClose }) {
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
            >
                {/* Dialog — stop propagation so clicking inside doesn't close */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                    style={{ maxHeight: "85vh", display: "flex", flexDirection: "column" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    {/* Body */}
                    <div className="px-6 py-5 overflow-y-auto text-sm text-gray-600 leading-relaxed">
                        {children}
                    </div>
                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                            style={{ background: "#1a3d28" }}
                            onMouseOver={e => (e.currentTarget.style.background = "#256639")}
                            onMouseOut={e  => (e.currentTarget.style.background = "#1a3d28")}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Modal Content ────────────────────────────────────────────────────────────

function PrivacyPolicyContent() {
    return (
        <>
            <p className="mb-4">
                
            </p>
            <p className="mb-3">
                AdventSphere is a digital platform dedicated to uploading, organising, and managing
                Seventh-day Adventist (SDA) programmes. We are committed to protecting your privacy
                and handling your personal information responsibly.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">1. Information We Collect</h3>
            <p className="mb-3">
                We collect information you provide when registering an account, uploading programme
                content, or contacting support. This may include your name, email address, role, and
                any programme materials you submit to the platform.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2. How We Use Your Information</h3>
            <p className="mb-3">
                Your information is used solely to operate and improve AdventSphere — enabling you
                to create, manage, and share SDA programme content digitally. We do not sell or share
                your personal data with third parties for marketing purposes.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">3. Data Storage & Security</h3>
            <p className="mb-3">
                All uploaded programmes and user data are stored securely. We employ
                industry-standard encryption and access controls to protect your information from
                unauthorised access, disclosure, or loss.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4. Your Rights</h3>
            <p className="mb-3">
                You may request access to, correction of, or deletion of your personal data at any
                time by contacting us at <strong>informkholdings@gmail.com</strong>.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">5. Changes to This Policy</h3>
            <p>
                We may update this Privacy Policy as the platform evolves. Continued use of
                AdventSphere after changes are posted constitutes acceptance of the updated policy.
            </p>
        </>
    );
}

function TermsContent() {
    return (
        <>
            <p className="mb-4">
                
            </p>
            <p className="mb-3">
                By accessing or using AdventSphere, you agree to these Terms of Service. AdventSphere
                is a platform designed for uploading and managing SDA (Seventh-day Adventist)
                programmes digitally within church communities and organisations.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">1. Acceptable Use</h3>
            <p className="mb-3">
                The platform is intended exclusively for the uploading, organisation, and management
                of SDA programmes and related content. Users must not upload material that is
                unlawful, offensive, or unrelated to the purpose of the platform.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2. User Accounts</h3>
            <p className="mb-3">
                You are responsible for maintaining the confidentiality of your account credentials.
                Any activity that occurs under your account is your responsibility. Please notify us
                immediately of any unauthorised use.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">3. Content Ownership</h3>
            <p className="mb-3">
                You retain ownership of all programme content you upload. By uploading content, you
                grant AdventSphere a limited licence to store and display that content to authorised
                users of the platform.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4. Termination</h3>
            <p className="mb-3">
                We reserve the right to suspend or terminate accounts that violate these terms or
                misuse the platform.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">5. Limitation of Liability</h3>
            <p>
                AdventSphere is provided "as is". We are not liable for any loss of data or
                interruption of service. We recommend keeping local backups of important programme
                materials.
            </p>
        </>
    );
}

function ContactContent() {
    return (
        <div className="flex flex-col gap-5">
            <p className="text-gray-500">
                Reach out to us through any of the channels below and we'll get back to you as soon
                as possible.
            </p>

            {/* Phone */}
            <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0faf4" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#1a3d28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.64-1.64a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                    <a href="tel:+263781406806" className="text-sm font-medium text-gray-800 hover:text-green-700 transition-colors">
                        +263 781 406 806
                    </a>
                </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0faf4" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#1a3d28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                    <a href="mailto:informkholdings@gmail.com" className="text-sm font-medium text-gray-800 hover:text-green-700 transition-colors">
                        informkholdings@gmail.com
                    </a>
                </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0faf4" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#1a3d28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Support Website</p>
                    <a href="https://elevatelt.co.zw" target="_blank" rel="noreferrer"
                        className="text-sm font-medium text-gray-800 hover:text-green-700 transition-colors">
                        elevatelt.co.zw
                    </a>
                </div>
            </div>
        </div>
    );
}

// ─── Footer Component ─────────────────────────────────────────────────────────

export default function Footer() {
    const [modal, setModal] = useState(null); // "privacy" | "terms" | "contact" | null

    return (
        <>
            <footer className="bg-gray-50 border-t border-gray-100 font-sans">
                {/* Top section */}
                <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-3 gap-8">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5">
                            {/* sda.png logo from public folder */}
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                                style={{ backgroundColor: "#1a3d28" }}
                            >
                                <img
                                    src="/sda.png"
                                    alt="AdventSphere"
                                    className="w-6 h-6 object-contain"
                                    onError={e => {
                                        e.target.style.display = "none";
                                        e.target.parentNode.innerHTML =
                                            `<span style="color:#fff;font-weight:800;font-size:14px">A</span>`;
                                    }}
                                />
                            </div>
                            <span className="text-base font-semibold text-gray-900">AdventSphere</span>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed">
                            A digital platform for uploading and managing SDA programmes,
                            keeping your church events organised and accessible.
                        </p>
                    </div>

                    {/* Support column — Contact Us only */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <button
                                    onClick={() => setModal("contact")}
                                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors text-left"
                                >
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Legal column */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <button
                                    onClick={() => setModal("privacy")}
                                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors text-left"
                                >
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModal("terms")}
                                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors text-left"
                                >
                                    Terms of Service
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Bottom bar */}
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <span className="text-sm text-gray-400">© 2026 AdventSphere. All rights reserved.</span>

                    <div className="flex items-center gap-4">
                        {socials.map(({ label, icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

            {/* ── Modals ── */}
            {modal === "privacy" && (
                <Modal title="Privacy Policy" onClose={() => setModal(null)}>
                    <PrivacyPolicyContent />
                </Modal>
            )}
            {modal === "terms" && (
                <Modal title="Terms of Service" onClose={() => setModal(null)}>
                    <TermsContent />
                </Modal>
            )}
            {modal === "contact" && (
                <Modal title="Contact Us" onClose={() => setModal(null)}>
                    <ContactContent />
                </Modal>
            )}
        </>
    );
}