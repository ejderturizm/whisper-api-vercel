export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { file_url } = req.body;

  if (!file_url) {
    return res.status(400).json({ error: "Missing 'file_url'" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: (() => {
        const data = new FormData();
        data.append("file", file_url);
        data.append("model", "whisper-1");
        return data;
      })()
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: "Failed to transcribe", details: e.toString() });
  }
}
