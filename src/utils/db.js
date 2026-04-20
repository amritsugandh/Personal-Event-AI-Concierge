import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Ensure user is in our Firestore collection
        const usersRef = collection(db, "concierge_users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        let localUser = null;
        if (querySnapshot.empty) {
            // Register new Google user
            localUser = { id: user.uid, email: user.email, name: user.displayName || 'Google User', authProvider: 'google', bio: '', interests: [] };
            await setDoc(doc(db, "concierge_users", localUser.id), localUser);
        } else {
            localUser = querySnapshot.docs[0].data();
        }
        
        return { success: true, user: localUser };
    } catch (e) {
        console.error("Google Login Error: ", e);
        return { error: "Google authentication failed or was cancelled." };
    }
};

export const registerUser = async (email, password, name) => {
    try {
        const usersRef = collection(db, "concierge_users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            return { error: "This email is already registered." };
        }
        
        const newUser = { id: Date.now().toString(), email, password, name, bio: '', interests: [] };
        await setDoc(doc(db, "concierge_users", newUser.id), newUser);
        return { success: true, user: newUser };
    } catch (e) {
        console.error(e);
        return { error: "Cloud connection failed." };
    }
};

export const loginUser = async (email, password) => {
    try {
        const usersRef = collection(db, "concierge_users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
             return { error: "Invalid email or password. Please sign up if you don't have an account." };
        }

        const user = querySnapshot.docs[0].data();
        if (user.password !== password) {
            return { error: "Invalid email or password." };
        }

        return { success: true, user };
    } catch (e) {
        console.error(e);
        return { error: "Cloud connection failed." };
    }
};

export const saveChatSession = async (userId, session) => {
    try {
        await setDoc(doc(db, `concierge_chats_${userId}`, session.id), session);
    } catch (e) {
        console.error("Error saving session: ", e);
    }
};

export const getChatSessions = async (userId) => {
    try {
        const sessionsRef = collection(db, `concierge_chats_${userId}`);
        const querySnapshot = await getDocs(sessionsRef);
        let sessions = [];
        querySnapshot.forEach((doc) => {
            sessions.push(doc.data());
        });
        return sessions.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (e) {
        console.error("Error getting sessions: ", e);
        return [];
    }
};

export const createNewSession = async (userId) => {
    const newSession = {
        id: Date.now().toString(),
        title: "New Search",
        createdAt: new Date().toISOString(),
        currentInputContext: "",
        navDirection: "Hello! I am your AI event concierge.\n\nOption 1: Tell me your background to track your itinerary.\nOption 2: Ask me 'What are the takeaways for React?' to pull session data.\nOption 3: Click the Microphone to use voice commands!",
        sessions: [],
        peers: []
    };
    await saveChatSession(userId, newSession);
    return newSession;
};
export const updateUserProfile = async (userId, data) => {
    try {
        await setDoc(doc(db, "concierge_users", userId), data, { merge: true });
        return { success: true };
    } catch (e) {
        console.error("Update Profile Error: ", e);
        return { error: "Failed to update profile." };
    }
};

export const logoutUser = async () => {
    try {
        await auth.signOut();
        return { success: true };
    } catch (e) {
        console.error("Sign Out Error: ", e);
        return { error: "Logout failed." };
    }
};
