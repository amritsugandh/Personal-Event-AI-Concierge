import { collection, doc, setDoc, query, where, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./db.js";

export const sendMeetingRequest = async (fromUser, toUserId, toUserName) => {
    try {
        const requestId = `${fromUser.id}_${toUserId}_${Date.now()}`;
        const requestData = {
            id: requestId,
            fromId: fromUser.id,
            fromName: fromUser.name,
            toId: toUserId,
            toName: toUserName,
            status: 'pending', // pending, accepted, declined
            timestamp: serverTimestamp()
        };
        await setDoc(doc(db, "concierge_meetings", requestId), requestData);
        return { success: true };
    } catch (e) {
        console.error("Meeting Request Error: ", e);
        return { error: "Could not send request." };
    }
};

export const subscribeToMeetings = (userId, callback) => {
    const q = query(collection(db, "concierge_meetings"), where("toId", "==", userId));
    return onSnapshot(q, (snapshot) => {
        const meetings = [];
        snapshot.forEach((doc) => {
            meetings.push(doc.data());
        });
        callback(meetings);
    });
};

export const updateMeetingStatus = async (requestId, newStatus) => {
    try {
        const meetingRef = doc(db, "concierge_meetings", requestId);
        await updateDoc(meetingRef, { status: newStatus });
        return { success: true };
    } catch (e) {
        console.error("Update Meeting Error: ", e);
        return { error: "Failed to update status." };
    }
};
