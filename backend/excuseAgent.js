const express = require("express");
const axios = require("axios");

const router = express.Router();
router.post("/generate-excuse", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    const response = await axios.post(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      {
        user_id: "sadam.fullstackdev@gmail.com",
        agent_id: "681b62fb3a77094175e02457",
        session_id: "681b62fb3a77094175e02457-btp1hoxdq7s",
        message: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Lyzr Agent Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Agent request failed" });
  }
});
module.exports = router;
