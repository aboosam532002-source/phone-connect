import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method not allowed" });

  const { phone } = req.body;

  try {
    const response = await vonage.sms.send({
      to: phone,
      from: "Vonage",   // ← تم إصلاحه هنا
      text: "Your verification code is: 123456"
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}
