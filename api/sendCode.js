import { Vonage } from "@vonage/server-sdk";

export default async function handler(req, res) {
  // CORS fix
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Missing phone or code" });
  }

  try {
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });

    const ncco = [
      {
        action: "talk",
        text: `Your verification code is ${code}`,
        language: "en-US",
        style: 2,
      },
    ];

    await vonage.voice.createOutboundCall({
      to: [{ type: "phone", number: phone }],
      from: { type: "phone", number: process.env.VONAGE_NUMBER },
      ncco,
    });

    return res.status(200).json({
      ok: true,
      message: "Voice call sent ✔️",
    });
  } catch (error) {
    console.error("Vonage error:", error);
    return res.status(500).json({ error: error.message });
  }
}
