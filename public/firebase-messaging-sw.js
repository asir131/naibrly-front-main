/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCTWLrx8f4mrIFKD9zRfvavD6VwDUrF6Uo",
  authDomain: "myporject-36306.firebaseapp.com",
  projectId: "myporject-36306",
  storageBucket: "myporject-36306.appspot.com",
  messagingSenderId: "769335574267",
  appId: "1:769335574267:web:e24d6dde3f1403c6b6ba5e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "Naibrly";
  const notificationOptions = {
    body: payload?.notification?.body || "",
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
