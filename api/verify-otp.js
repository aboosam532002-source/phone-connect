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

  const { phone, code } = await req.json();

  if (!phone || !code) {
    return new Response(
      JSON.stringify({ error: "Phone and code required" }),
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }

  globalThis.otpStore = globalThis.otpStore || {};
  const stored = globalThis.otpStore[phone];

  if (!stored) {
    return new Response(
      JSON.stringify({ success: false, message: "No OTP sent" }),
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }

  if (stored.expires < Date.now()) {
    delete globalThis.otpStore[phone];
    return new Response(
      JSON.stringify({ success: false, message: "Expired code" }),
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }

  if (stored.code !== code) {
    return new Response(
      JSON.stringify({ success: false, message: "Incorrect code" }),
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }

  // success
  delete globalThis.otpStore[phone];

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" }
    }
  );
}
