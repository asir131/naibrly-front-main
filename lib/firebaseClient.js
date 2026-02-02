import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const initFirebase = () => {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
};

export const registerMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;

  initFirebase();
  const messaging = getMessaging();
  return messaging;
};

export const requestFcmToken = async () => {
  const messaging = await registerMessaging();
  if (!messaging) return null;

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) return null;

  const token = await getToken(messaging, { vapidKey });
  return token || null;
};

export const onForegroundMessage = async (handler) => {
  const messaging = await registerMessaging();
  if (!messaging) return null;
  return onMessage(messaging, handler);
};
