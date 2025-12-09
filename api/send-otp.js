export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const params = new URLSearchParams();
    params.append("api_key", process.env.VONAGE_API_KEY);
    params.append("api_secret", process.env.VONAGE_API_SECRET);
    params.append("to", phone);
    params.append("from", process.env.VONAGE_BRAND_NAME || "Verify");
    params.append("text", "Your verification code is 123456");

    const response = await fetch("https://rest.nexmo.com/sms/json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Vonage Error:", error);
    return res.status(500).json({ error: "Failed to send SMS", details: error });
  }
}
