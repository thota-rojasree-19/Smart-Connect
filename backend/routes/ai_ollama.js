import express from "express";
import axios from "axios";

const router = express.Router();

// POST /reply
// body: { prompt: string, model?: string }
router.post("/reply", async (req, res) => {
  const { prompt } = req.body || {};
  let model = req.body?.model; // may be undefined
  if (typeof model === "string") {
    model = model.trim();
    if (model === "") model = undefined;
  }
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Missing or invalid 'prompt' in request body" });
  }

  // Ollama defaults to running locally on port 11434
  const ollamaBase = process.env.OLLAMA_URL_BASE || "http://localhost:11434";
  const ollamaUrl = process.env.OLLAMA_URL || `${ollamaBase}/api/generate`;

  try {
    // If no model provided by client, try to discover a usable model from Ollama
    const ollamaBase = process.env.OLLAMA_URL_BASE || "http://localhost:11434";
    if (!model) {
      try {
        const found = await getAvailableModels(ollamaBase);
        const list = found?.data || [];
        const normalized = Array.isArray(list)
          ? list.map((m) => (typeof m === "string" ? m : m.id || m.name || JSON.stringify(m)))
          : [];
        model = normalized.find((m) => m === "phi3:latest") || normalized[0] || undefined;
      } catch (e) {
        // ignore and proceed; axios.post will report model-not-found if necessary
      }
    }
    const ollamaBase2 = process.env.OLLAMA_URL_BASE || "http://localhost:11434";
    const ollamaUrl = process.env.OLLAMA_URL || `${ollamaBase2}/api/generate`;
    const body = { prompt };
    if (model) body.model = model;
    console.log("→ Ollama request", { model: model || null });
    const response = await axios.post(
      ollamaUrl,
      body,
      { headers: { "Content-Type": "application/json" }, timeout: 20000 }
    );

    const data = response?.data || {};

    // Try common response shapes from Ollama
    // 1) { results: [ { content: [ { type: 'output_text', text: '...' } ] } ] }
    const firstResult = data.results?.[0];
    if (firstResult && Array.isArray(firstResult.content)) {
      const pieces = firstResult.content.map((c) => c.text || c?.output || "");
      const text = pieces.join("");
      return res.json({ reply: text });
    }

    // 2) { text: '...' }
    if (typeof data.text === "string") return res.json({ reply: data.text });

    // 3) raw string or other
    if (typeof data === "string") return res.json({ reply: data });

    // Otherwise, return full data for debugging
    return res.json({ reply: JSON.stringify(data) });
  } catch (err) {
      console.error("Ollama proxy error:", err.response?.data || err.message || err);
      const status = err.response?.status || 500;
      const payload = err.response?.data || { message: err.message };

      // If Ollama says the model is not found, attempt to list available models and return them
      const errMsg = (payload && payload.error) ? payload.error : (payload.message || JSON.stringify(payload));
      if (typeof errMsg === "string" && errMsg.toLowerCase().includes("model") && errMsg.toLowerCase().includes("not")) {
        try {
          const modelsRes = await axios.get(`${ollamaBase}/api/models`, { timeout: 5000 });
          const models = modelsRes.data?.map((m) => m.name || m) || modelsRes.data || [];
          return res.status(404).json({ message: "Requested model not found on Ollama", availableModels: models, error: errMsg });
        } catch (mlErr) {
          console.error("Failed to fetch Ollama models:", mlErr.response?.data || mlErr.message || mlErr);
          return res.status(status).json({ message: "Ollama request failed", error: errMsg });
        }
      }

      return res.status(status).json({ message: "Ollama request failed", error: payload });
  }
});

// Helper: try multiple endpoints to list models
async function getAvailableModels(ollamaBase) {
  const candidatePaths = [
    "/api/models",
    "/models",
    "/api/list",
    "/list",
    "/v1/models",
    "/api/v1/models",
  ];

  for (const p of candidatePaths) {
    try {
      const url = `${ollamaBase}${p}`;
      const r = await axios.get(url, { timeout: 5000 });
      if (r && r.status >= 200 && r.status < 300 && r.data) return { data: r.data, path: p };
    } catch (e) {
      // ignore and try next
    }
  }

  // last-resort attempt: try the base URL
  try {
    const r2 = await axios.get(ollamaBase, { timeout: 3000 });
    if (r2 && r2.status >= 200 && r2.status < 300 && r2.data) return { data: r2.data, path: "/" };
  } catch (e) {
    // give up
  }

  return null;
}

// Simple health endpoint to check proxy availability
router.get("/health", (req, res) => {
  return res.json({ ok: true, message: "Ollama proxy alive" });
});

// Return list of models installed in Ollama (proxied)
router.get("/models", async (req, res) => {
  const ollamaBase = process.env.OLLAMA_URL_BASE || "http://localhost:11434";
  try {
    const found = await getAvailableModels(ollamaBase);
    if (!found) return res.status(404).json({ message: "No models endpoint found on Ollama" });
    return res.json(found.data || []);
  } catch (err) {
    console.error("Failed to fetch Ollama models:", err.response?.data || err.message || err);
    const status = err.response?.status || 500;
    const payload = err.response?.data || { message: err.message };
    return res.status(status).json({ message: "Failed to fetch Ollama models", error: payload });
  }
});

export default router;
