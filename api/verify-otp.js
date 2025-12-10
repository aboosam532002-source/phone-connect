export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Phone and code are required" });
  }

  // قراءة الكود الصحيح من قاعدة البيانات المؤقتة (مثال)
  // لاحقًا بنربطه ب Redis أو Supabase
  const stored = global.otpStore?.[phone];

  if (!stored) {
    return res.status(400).json({ success: false, message: "No OTP was sent to this number" });
  }

  if (stored.code !== code) {
    return res.status(400).json({ success: false, message: "Incorrect code" });
  }

  // تحقق من انتهاء صلاحية الكود
  if (Date.now() > stored.expireAt) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  // نجاح التحقق
  return res.status(200).json({ success: true, message: "OTP verified successfully" });
}

