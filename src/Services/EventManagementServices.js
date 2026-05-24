// Services/CreateEventServices.js

import { db, storage } from "./firebase"; // Your Firebase config
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "firebase/storage";

// Collection reference
const eventsCollection = collection(db, "events");

// Create event with optional image upload
export async function createEvent(eventData, imageFile = null, onProgress = null) {
    try {
        let imageUrl = null;

        // Upload image if provided
        if (imageFile) {
            imageUrl = await uploadImage(imageFile, onProgress);
        }

        // Prepare event document
        const eventDoc = {
            ...eventData,
            imageUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await addDoc(eventsCollection, eventDoc);
        return docRef.id;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

// Update existing event
export async function updateEvent(eventId, eventData, imageFile = null, onProgress = null) {
    try {
        let imageUrl = eventData.imageUrl; // Keep existing image URL

        // Upload new image if provided
        if (imageFile) {
            // Optional: Delete old image first
            if (eventData.imageUrl) {
                await deleteImageFromUrl(eventData.imageUrl);
            }
            imageUrl = await uploadImage(imageFile, onProgress);
        }

        // Prepare update data
        const updateData = {
            ...eventData,
            imageUrl,
            updatedAt: new Date().toISOString(),
        };

        // Remove id from update data if present
        delete updateData.id;

        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, updateData);
        return eventId;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
}

// Delete event and its associated image
export async function deleteEvent(eventId) {
    try {
        // First get the event to check for image
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
            const eventData = eventSnap.data();

            // Delete associated image if exists
            if (eventData.imageUrl) {
                await deleteImageFromUrl(eventData.imageUrl);
            }
        }

        // Delete the document
        await deleteDoc(eventRef);
        return true;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

// Helper: Upload image to Firebase Storage
async function uploadImage(file, onProgress) {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const filename = `events/${timestamp}_${file.name}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(Math.round(progress));
            },
            (error) => reject(error),
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
            }
        );
    });
}

// Helper: Delete image from Firebase Storage
async function deleteImageFromUrl(imageUrl) {
    try {
        // Extract path from URL
        const decodedUrl = decodeURIComponent(imageUrl);
        const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch && pathMatch[1]) {
            const imagePath = pathMatch[1];
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
        }
    } catch (error) {
        console.warn("Failed to delete image:", error);
        // Don't throw - continue with document deletion even if image deletion fails
    }
}

// Subscribe to real-time events
export function subscribeToEvents(onData, onError) {
    const q = query(eventsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const events = [];
            snapshot.forEach((doc) => {
                events.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            onData(events);
        },
        (error) => {
            console.error("Firestore subscription error:", error);
            const isNetwork = error.message?.includes("network") || error.message?.includes("unavailable");
            onError(error.message, isNetwork);
        }
    );

    return unsubscribe;
}

// Optional: Get single event
export async function getEvent(eventId) {
    try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
            return { id: eventSnap.id, ...eventSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting event:", error);
        throw error;
    }
}