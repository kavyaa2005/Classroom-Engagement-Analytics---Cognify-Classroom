const fetch = require("node-fetch");
const FormData = require("form-data");

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * Send a frame buffer to the Python AI microservice.
 * @param {Buffer} frameBuffer  - Raw image buffer (JPEG/PNG)
 * @param {string} studentId    - For logging/tracing
 * @returns {Object}  { engagement_score, state, confidence }
 */
const predictEngagement = async (frameBuffer, studentId = "unknown") => {
  try {
    const form = new FormData();
    form.append("file", frameBuffer, {
      filename: `frame_${studentId}_${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    const response = await fetch(`${AI_URL}/predict`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
      timeout: 8000, // 8 s timeout — non-blocking
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`AI service error ${response.status}: ${errBody}`);
    }

    const result = await response.json();

    // Validate expected keys
    if (
      typeof result.engagement_score !== "number" ||
      typeof result.state !== "string" ||
      typeof result.confidence !== "number"
    ) {
      throw new Error("AI service returned unexpected response shape.");
    }

    return result; // { engagement_score, state, confidence }
  } catch (error) {
    // Return a graceful fallback so one bad frame doesn't crash the session
    console.error(`⚠️  AI service unavailable for student ${studentId}: ${error.message}`);
    return {
      engagement_score: 0,
      state: "Inactive",
      confidence: 0,
      error: error.message,
    };
  }
};

module.exports = { predictEngagement };
