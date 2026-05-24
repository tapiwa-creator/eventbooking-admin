// ─────────────────────────────────────────────────────────────────────────────
// AuthService.js
// Integrates with Firebase Authentication and Firestore
// Handles sign-in, registration, session persistence, and auth state helpers.
// ─────────────────────────────────────────────────────────────────────────────

import { auth, db } from "../firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    setPersistence, 
    browserSessionPersistence, 
    updatePassword,
    updateEmail as firebaseUpdateEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const SESSION_KEY = "adventsphere_session";

// ── Internal helpers ──────────────────────────────────────────────────────────

function persistSession(user) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
        // Storage unavailable — silent fail
    }
}

function clearSession() {
    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch {
        // ignore
    }
}

function buildSessionUser(record, uid) {
    return {
        id: uid,
        firstName: record.firstName,
        lastName: record.lastName,
        name: `${record.firstName} ${record.lastName}`,
        email: record.email,
        createdAt: record.createdAt,
    };
}

// ── Public API ────────────────────────────────────────────────────────────────

const AuthService = {
    /**
     * Register a new user in Firebase Auth & Firestore.
     */
    async register({ firstName, lastName, email, password }) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
            const user = userCredential.user;
            
            const userData = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password: password, // Stored as requested
                passwordHash: btoa(password),
                createdAt: new Date().toISOString(),
            };
            
            await setDoc(doc(db, "users", user.uid), userData);
            
            return { success: true };
        } catch (error) {
            let errorMsg = error.message;
            if (error.code === 'auth/email-already-in-use') errorMsg = "An account with this email already exists.";
            if (error.code === 'auth/weak-password') errorMsg = "Password should be at least 6 characters.";
            return { success: false, error: errorMsg };
        }
    },

    /**
     * Sign in an existing user with Firebase Auth.
     */
    async signIn({ email, password }) {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
            const user = userCredential.user;
            
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const sessionUser = buildSessionUser(docSnap.data(), user.uid);
                persistSession(sessionUser);
                return { success: true, user: sessionUser };
            } else {
                // Fallback if missing firestore record
                const sessionUser = { id: user.uid, email: user.email, name: "Admin" };
                persistSession(sessionUser);
                return { success: true, user: sessionUser };
            }
        } catch (error) {
            let errorMsg = error.message;
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMsg = "Invalid email or password.";
            }
            return { success: false, error: errorMsg };
        }
    },

    /**
     * Sign the current user out and clear the session.
     */
    async signOut() {
        try {
            await firebaseSignOut(auth);
        } catch(e) {
            console.error("Firebase signout error:", e);
        }
        clearSession();
    },

    /**
     * Return the currently authenticated user from local storage (synchronous UI helper).
     */
    getCurrentUser() {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return Boolean(this.getCurrentUser());
    },

    /**
     * Update display name fields in Firestore.
     */
    async updateProfile(updates) {
        const current = this.getCurrentUser();
        if (!current) {
            return { success: false, error: "Not authenticated." };
        }

        try {
            const userRef = doc(db, "users", current.id);
            await updateDoc(userRef, updates);

            // Update local session
            const newSession = { ...current, ...updates };
            if (newSession.firstName && newSession.lastName) {
                newSession.name = `${newSession.firstName} ${newSession.lastName}`;
            }
            persistSession(newSession);

            return { success: true, user: newSession };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Change Email (Requires Re-auth)
     */
    async changeEmail(currentEmail, currentPassword, newEmail) {
        try {
            await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
            await firebaseUpdateEmail(auth.currentUser, newEmail);
            
            // update in DB
            const user = auth.currentUser;
            await updateDoc(doc(db, "users", user.uid), { email: newEmail });
            
            // update session
            const currentSession = this.getCurrentUser();
            const newSession = { ...currentSession, email: newEmail };
            persistSession(newSession);
            
            return { success: true, user: newSession };
        } catch(error) {
            let errorMsg = error.message;
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMsg = "Incorrect current password.";
            if (error.code === 'auth/email-already-in-use') errorMsg = "An account with this email already exists.";
            return { success: false, error: errorMsg };
        }
    },

    /**
     * Change Password (Requires Re-auth)
     */
    async changePassword(email, currentPassword, newPassword) {
        try {
            await signInWithEmailAndPassword(auth, email, currentPassword);
            await updatePassword(auth.currentUser, newPassword);
            return { success: true };
        } catch(error) {
            let errorMsg = error.message;
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMsg = "Incorrect current password.";
            return { success: false, error: errorMsg };
        }
    }
};

export default AuthService;