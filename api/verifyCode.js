// api/verifyCode.js
globalThis.otpStore = globalThis.otpStore || {};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "phone and code required" });

  const rec = globalThis.otpStore[phone];
  if (!rec) return res.status(400).json({ success: false, message: "No OTP sent" });

  if (Date.now() > rec.expires) {
    delete globalThis.otpStore[phone];
    return res.status(400).json({ success: false, message: "Expired code" });
  }

  if (rec.code !== String(code).trim()) {
    return res.status(400).json({ success: false, message: "Incorrect code" });
  }

  delete globalThis.otpStore[phone];
  return res.status(200).json({ success: true, message: "Verified" });
}
