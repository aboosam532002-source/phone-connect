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

  try {
    const parsed = JSON.parse(raw);
    console.log("VOICE EVENT PARSED:", parsed);
  } catch {
    console.log("VOICE EVENT PARSE ERROR");
  }

  res.status(200).end();
}
