// src/api/weatherAgent.js
import axios from "axios";

export async function sendToWeatherAgent(fullPrompt, signal) {
  const res = await axios.post(
    "https://mock-ai-api.onrender.com/test-agent",
    {
      prompt: fullPrompt,
      stream: false
    },
    {
      signal
    }
  );

  return res.data.response;
}
