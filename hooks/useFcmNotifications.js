"use client";

import { useEffect, useRef } from "react";
import { onForegroundMessage, requestFcmToken } from "@/lib/firebaseClient";
import toast from "react-hot-toast";

const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch (error) {
    console.error("FCM service worker registration failed:", error);
    return null;
  }
};

export const useFcmNotifications = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return;
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return false;

      await registerServiceWorker();

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await requestFcmToken();
        if (!token) return;
        console.log("FCM device token:", token);

        const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const endpoint = apiBase
          ? `${apiBase}/notifications/device-token`
          : "/api/notifications/device-token";
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token, platform: "web" }),
        });
      } catch (error) {
        console.error("FCM init error:", error);
      }

      onForegroundMessage((payload) => {
        const title = payload?.notification?.title || "Naibrly";
        const body = payload?.notification?.body || "";
        if (body) {
          toast.success(`${title}: ${body}`);
        } else {
          toast.success(title);
        }
      });

      return true;
    };

    if (initializedRef.current) return;

    const tryInit = async () => {
      const success = await init();
      if (success) {
        initializedRef.current = true;
      }
    };

    tryInit();

    const interval = setInterval(() => {
      if (initializedRef.current) {
        clearInterval(interval);
        return;
      }
      tryInit();
    }, 3000);

    const storageHandler = () => {
      if (!initializedRef.current) {
        tryInit();
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);
};
