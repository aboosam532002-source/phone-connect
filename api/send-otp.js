export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone is required" });
  }

  const apiKey = process.env.VONAGE_API_KEY;
  const apiSecret = process.env.VONAGE_API_SECRET;
  const brand = process.env.VONAGE_BRAND_NAME;

  const params = new URLSearchParams();
  params.append("api_key", apiKey);
  params.append("api_secret", apiSecret);
  params.append("to", phone);
  params.append("from", brand);
  params.append("text", "Your verification code is: 123456");

  try {
    const response = await fetch("https://rest.nexmo.com/sms/json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
