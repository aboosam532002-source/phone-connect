import { Vonage } from "@vonage/server-sdk";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { phone } = req.body;

    const vonage = new Vonage({
        applicationId: process.env.VONAGE_APPLICATION_ID,
        privateKey: process.env.VONAGE_PRIVATE_KEY, // من Environment Variables
    });

    try {
        const response = await vonage.sms.send({
            to: phone,
            from: "Verify", // اسم مرسل
            text: "Your verification code is 123456"
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Vonage Error:", error);
        res.status(500).json({ error: "Failed to send SMS", details: error });
    }
}
