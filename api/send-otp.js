export const config = {
  runtime: "edge",
};

// CORS handler
function handleCORS(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return null;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req) {
  // CORS
  const cors = handleCORS(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }

  const { phone } = await req.json();
  if (!phone) {
    return new Response(
      JSON.stringify({ error: "Missing phone" }),
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }

  const code = generateOTP();
  globalThis.otpStore = globalThis.otpStore || {};
  globalThis.otpStore[phone] = {
    code,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    const vonage = new (require("@vonage/server-sdk").Vonage)({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
      applicationId: process.env.VONAGE_APPLICATION_ID,
      privateKey: process.env.VONAGE_PRIVATE_KEY,
    });

    const ncco = [
      {
        action: "talk",
        text: `Your verification code is ${code.split("").join(" ")}`,
        voiceName: "Joey",
      },
    ];

    await vonage.voice.createCall({
      to: [{ type: "phone", number: phone }],
      from: [{ type: "phone", number: process.env.VONAGE_NUMBER }],
      ncco,
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  } catch (err) {
    console.error("Vonage error:", err);
    return new Response(
      JSON.stringify({ error: "Vonage failed" }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }
}
