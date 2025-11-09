import { useEffect } from "react";
import { useLocation } from "react-router-dom";

async function sendFrontendLog(level, message) {
  const BACKEND_LOG_URL = "http://127.0.0.1:8000/frontend/logs";
  const logData = {
    level,
    message,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
  try {
    await fetch(BACKEND_LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
  } catch (err) {
    console.warn("Failed to send route log:", err);
  }
}

export function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    sendFrontendLog("INFO", `Visited route: ${location.pathname}`);
  }, [location.pathname]);

  return null;
}
