export default async function handler(req, res) {
  // قراءة الـ RAW BODY يدويًا
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const rawBody = Buffer.concat(buffers).toString();

  console.log("VOICE EVENT RAW BODY:", rawBody);

  let data = {};
  try {
    data = JSON.parse(rawBody);
  } catch (e) {
    console.log("Error parsing JSON:", e);
  }

  console.log("VOICE EVENT PARSED:", data);

  // vonage expects 200 OK with no content
  res.status(200).end();
}
