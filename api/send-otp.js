import Vonage from "@vonage/server-sdk";

export default async function handler(req, res) {
  try {
    const { phone } = req.body;

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);

    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
      applicationId: process.env.VONAGE_APPLICATION_ID,
      privateKey: process.env.VONAGE_PRIVATE_KEY_PATH
    });

    await vonage.voice.createOutboundCall({
      to: [
        {
          type: "phone",
          number: phone
        }
      ],
      from: {
        type: "phone",
        number: process.env.VONAGE_NUMBER
      },
      answer_url: [
        `${process.env.VERCEL_URL}/api/voice/answer?code=${code}`
      ]
    });

    res.status(200).json({ success: true, code });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Call failed", details: error });
  }
}
