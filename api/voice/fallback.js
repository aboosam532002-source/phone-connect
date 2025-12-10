export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  let raw = "";

  for await (const chunk of req) {
    raw += chunk;
  }

  console.log("VOICE FALLBACK RAW:", raw);

  try {
    const parsed = JSON.parse(raw);
    console.log("VOICE FALLBACK PARSED:", parsed);
  } catch {
    console.log("VOICE FALLBACK PARSE ERROR");
  }

  res.status(200).end();
}
