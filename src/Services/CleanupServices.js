import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { deleteEvent } from "./EventManagementServices";
import { deleteBookingsByEvent } from "./BookingsServices";

export async function cleanupOldEvents() {
    try {
        const eventsRef = collection(db, "events");
        const snapshot = await getDocs(eventsRef);

        const now = new Date();
        let deletedCount = 0;

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            if (data.date) {
                const eventDate = new Date(data.date);
                // Calculate difference in time
                const diffTime = now.getTime() - eventDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                // If event was in the past and > 10 days ago
                if (diffDays > 10) {
                    console.log(`🧹 Cleaning up old event: ${data.title}`);
                    // Delete bookings
                    await deleteBookingsByEvent(docSnap.id);
                    // Delete event and image
                    await deleteEvent(docSnap.id);
                    deletedCount++;
                }
            }
        }

        if (deletedCount > 0) {
            console.log(`✅ Automated Cleanup Complete. Deleted ${deletedCount} old events.`);
        }
    } catch (error) {
        console.error("Error during automated event cleanup:", error);
    }
}
