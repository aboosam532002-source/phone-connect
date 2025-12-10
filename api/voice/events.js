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

  console.log("VOICE EVENT RAW:", raw);

  const parsed = querystring.parse(raw);
  console.log("VOICE EVENT PARSED:", parsed);

  res.status(200).end();
}
