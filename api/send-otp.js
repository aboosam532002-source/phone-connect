import { Vonage } from "@vonage/server-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
  });

  try {
    const response = await vonage.verify.start({
      number: phone,
      brand: "Verify",
    });

    return res.status(200).json({ request_id: response.request_id });
  } catch (error) {
    console.error("Vonage Error:", error);
    return res.status(500).json({ error: "Verification failed", details: error });
  }
}
