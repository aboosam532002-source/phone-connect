// إنشاء تخزين مؤقت للكود (OTP) إذا غير موجود
if (!global.otpStore) {
  global.otpStore = {};
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Missing phone" });

  const code = generateOTP();

  // حفظ الكود في التخزين المؤقت
  global.otpStore[phone] = {
    code: code,
    expires: Date.now() + 2 * 60 * 1000 // مدة الحياة 2 دقيقة
  };

  try {
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
      applicationId: process.env.VONAGE_APPLICATION_ID,
      privateKey: process.env.VONAGE_PRIVATE_KEY,
    });

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

  }
