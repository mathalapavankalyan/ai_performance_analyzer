import axios from "axios";


const BASE_URL = "http://127.0.0.1:8000";
const FRONTEND_LOG_URL = `${BASE_URL}/frontend/logs`;
const isDev = process.env.NODE_ENV === "development";


async function log(level, message) {
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
    await fetch(FRONTEND_LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
  } catch (err) {
    if (isDev) console.warn("Failed to send frontend log:", err);
  }
}


export const getAllBlogs = async () => {
  try {
    await log("INFO", "Fetching all blogs from backend");
    const response = await axios.get(`${BASE_URL}/blogs/get_all_blogs`);
    await log(
      "INFO",
      `Fetched ${response.data?.length || 0} blogs successfully`
    );
    return response.data;
  } catch (error) {
    await log("ERROR", `Error fetching blogs: ${error.message}`);
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const likeBlog = async (id, liked) => {
  try {
    await log("INFO", `Liking blog ID=${id}, liked=${liked}`);
    const response = await axios.post(`${BASE_URL}/blogs/${id}/like`, {
      liked,
    });
    await log("INFO", `Successfully updated like for blog ID=${id}`);
    return response.data;
  } catch (error) {
    await log("ERROR", `Failed to like blog ID=${id}: ${error.message}`);
    console.error("Error liking blog:", error);
    throw error;
  }
};
