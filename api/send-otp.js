import { Vonage } from "@vonage/server-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;

  const vonage = new Vonage({
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY,
  });

  const code = Math.floor(100000 + Math.random() * 900000);

  const ncco = [
    {
      action: "talk",
      text: `Your verification code is ${code}`,
      language: "en-US",
      style: 2
    }
  ];

  try {
    const response = await vonage.voice.createOutboundCall({
      to: [{ type: "phone", number: phone }],
      from: { type: "phone", number: process.env.VONAGE_NUMBER },
      ncco
    });

    return res.status(200).json({
      success: true,
      code,
      vonageResponse: response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Voice call failed",
      details: error
    });
  }
}
