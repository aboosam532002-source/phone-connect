// api/sendCode.js
import { Vonage } from "@vonage/server-sdk";

// simple in-memory store (for testing only)
globalThis.otpStore = globalThis.otpStore || {};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Missing phone" });

    // generate OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // save in memory for 5 minutes
    globalThis.otpStore[phone] = { code, expires: Date.now() + 5 * 60 * 1000 };

    // create Vonage client (private key as full PEM content)
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
      applicationId: process.env.VONAGE_APPLICATION_ID,
      privateKey: process.env.VONAGE_PRIVATE_KEY, // full PEM content
    });

    // NCCO talk action (spell digits spaced)
    const ncco = [
      {
        action: "talk",
        text: `Your verification code is ${code.split("").join(" ")}`,
        voiceName: "Joey"
      }
    ];

    await vonage.voice.createCall({
      to: [{ type: "phone", number: phone }],
      from: { type: "phone", number: process.env.VONAGE_NUMBER },
      ncco
    });

    return res.status(200).json({ success: true, message: "Call placed" });
  } catch (err) {
    console.error("sendCode error:", err);
    return res.status(500).json({ success: false, error: err.message || "Vonage error" });
  }
}
