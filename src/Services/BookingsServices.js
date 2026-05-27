import {
    collection,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    where,
    getDocs
} from "firebase/firestore";
import { db } from "../firebase";

const BOOKINGS_COL = "bookings";

export async function createBooking(bookingData) {
    try {
        const bookingsRef = collection(db, BOOKINGS_COL);

        const bookingPayload = {
            ...bookingData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(bookingsRef, bookingPayload);
// removed // console.log

        return docRef.id;
    } catch (error) {
        console.error("❌ Error saving booking:", error);
        throw new Error("Failed to save booking. Please try again.");
    }
}

// Get all bookings with real-time subscription
export function subscribeToBookings(callback, onError) {
    const bookingsRef = collection(db, BOOKINGS_COL);
    const q = query(bookingsRef, orderBy("createdAt", "desc"));

    return onSnapshot(
        q,
        (snapshot) => {
            const bookings = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                bookings.push({
                    id: doc.id,
                    ...data,
                    bookingDate: data.bookingDate || data.createdAt?.toDate?.()?.toISOString(),
                });
            });
            callback(bookings);
        },
        (error) => {
            console.error("Firestore listener error:", error);
            onError?.(error);
        }
    );
}

// Get bookings for a specific event
export async function getBookingsByEvent(eventId) {
    try {
        const bookingsRef = collection(db, BOOKINGS_COL);
        const q = query(bookingsRef, where("eventId", "==", eventId), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching event bookings:", error);
        throw error;
    }
}

// Update booking status
export async function updateBookingStatus(bookingId, newStatus) {
    try {
        const bookingRef = doc(db, BOOKINGS_COL, bookingId);
        await updateDoc(bookingRef, {
            status: newStatus,
            updatedAt: serverTimestamp(),
        });
// removed // console.log
        return true;
    } catch (error) {
        console.error("Error updating booking status:", error);
        throw new Error("Failed to update booking status");
    }
}

// Get user bookings by email
export async function getUserBookings(email) {
    try {
        const bookingsRef = collection(db, BOOKINGS_COL);
        const q = query(bookingsRef, where("attendeeEmail", "==", email), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        throw error;
    }
}
