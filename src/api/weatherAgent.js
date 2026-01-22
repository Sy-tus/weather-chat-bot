import axios from "axios";

const API_URL = "https://mock-ai-api.onrender.com/test-agent";

export async function sendToWeatherAgent(prompt) {
  const res = await axios.post(API_URL, {
    prompt,
    stream: true,
  });
  return res.data.response;
}
