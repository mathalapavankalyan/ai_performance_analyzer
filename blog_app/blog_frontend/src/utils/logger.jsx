
const BACKEND_LOG_URL = "http://127.0.0.1:8000/frontend/logs"; 
const isDev = process.env.NODE_ENV === "development";

/**
 * Logs events to console (in dev) and sends them to the backend.
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message to record
 */
export async function log(level, message) {
  const logData = {
    level,
    message,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  if (isDev) {
    console.log(
      `${logData.timestamp} | Level=${level} | Message=${message} | URL=${logData.url}`
    );
  }

  try {
    await fetch(BACKEND_LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
  } catch (err) {
    if (isDev) console.warn("Failed to send frontend log:", err);
  }
}
