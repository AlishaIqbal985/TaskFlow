
import api from "./api";

export async function testBackendConnection() {
  try {
    const response = await api.get("/api/health");
    console.log("Backend connected:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Backend connection failed:",
      error.response?.data || error.message
    );
    return null;
  }
}
