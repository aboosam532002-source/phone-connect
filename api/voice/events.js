export default function handler(req, res) {
  console.log("VOICE EVENT:", req.body);
  res.status(200).end();
}
