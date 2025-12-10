import querystring from "querystring";

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

  const parsed = querystring.parse(raw);
  console.log("VOICE FALLBACK PARSED:", parsed);

  res.status(200).end();
}
