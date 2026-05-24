import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";

import { db } from "../firebase"; // ONLY Firestore (no storage)
import { uploadEventImage } from "../Services/uploadImage"; // ✅ Supabase ONLY

// ─── CONFIG ────────────────────────────────────────────────────────────────

const EVENTS_COL = "events";

const eventsRef = () => collection(db, EVENTS_COL);

// ─── HELPERS ───────────────────────────────────────────────────────────────

function docToEvent(snapshot) {
    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    const toISO = (v) =>
        v instanceof Timestamp ? v.toDate().toISOString() : v;

    return {
        id: snapshot.id,
        ...data,
        createdAt: toISO(data.createdAt),
        updatedAt: toISO(data.updatedAt),
    };
}

function sanitise(data) {
    if (!data) return {};

    const clean = { ...data };

    // Never allow client-side blobs or previews into Firestore
    delete clean.imagePreview;
    delete clean.imageFile;

    return clean;
}

// ─── CREATE EVENT ───────────────────────────────────────────────────────────

export async function createEvent(eventData, imageFile = null) {
    try {
        let imageUrl = null;

        // ✅ Supabase upload (ONLY image system)
        if (imageFile instanceof File) {
            imageUrl = await uploadEventImage(imageFile);
        }

        const payload = {
            ...sanitise(eventData),
            imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(eventsRef(), payload);

        console.log("✅ Event created:", docRef.id);
        return docRef.id;
    } catch (err) {
        console.error("❌ createEvent error:", err);
        throw err;
    }
}

// ─── GET EVENTS ─────────────────────────────────────────────────────────────

export async function getEvents() {
    const snap = await getDocs(
        query(eventsRef(), orderBy("createdAt", "desc"))
    );

    return snap.docs.map(docToEvent).filter(Boolean);
}

// ─── GET SINGLE EVENT ───────────────────────────────────────────────────────

export async function getEvent(id) {
    const snap = await getDoc(doc(db, EVENTS_COL, id));
    return docToEvent(snap);
}

// ─── UPDATE EVENT ───────────────────────────────────────────────────────────

export async function updateEvent(id, data, imageFile = null) {
    try {
        let imageUrl = data.imageUrl;

        // Replace image if new file provided
        if (imageFile instanceof File) {
            imageUrl = await uploadEventImage(imageFile);
        }

        const payload = {
            ...sanitise(data),
            ...(imageUrl ? { imageUrl } : {}),
            updatedAt: serverTimestamp(),
        };

        await updateDoc(doc(db, EVENTS_COL, id), payload);

        console.log("✅ Event updated:", id);
    } catch (err) {
        console.error("❌ updateEvent error:", err);
        throw err;
    }
}

// ─── DELETE EVENT ───────────────────────────────────────────────────────────

export async function deleteEvent(id) {
    try {
        await deleteDoc(doc(db, EVENTS_COL, id));

        console.log("🗑️ Event deleted:", id);
    } catch (err) {
        console.error("❌ deleteEvent error:", err);
        throw err;
    }
}

// ─── REALTIME SUBSCRIPTION ─────────────────────────────────────────────────

export function subscribeToEvents(callback, onError) {
    const q = query(eventsRef(), orderBy("createdAt", "desc"));

    return onSnapshot(
        q,
        (snap) => {
            const events = snap.docs.map(docToEvent).filter(Boolean);
            callback(events);
        },
        (err) => {
            console.error("🔥 Firestore listener error:", err);
            onError?.(err);
        }
    );
}