const express = require("express");
const axios = require("axios");
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`, {
        params: {
          key: YOUTUBE_API_KEY,
          part: "snippet",
          q,
          maxResults: 6,
          type: "video",
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("YouTube API error:", err.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

module.exports = router;