export default async function handler(req, res) {
  const { phone } = req.body;

  const response = await fetch("https://api.nexmo.com/verify/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.VONAGE_KEY,
      api_secret: process.env.VONAGE_SECRET,
      number: phone,
      brand: "PhoneConnect"
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
