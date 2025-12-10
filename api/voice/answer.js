export default function handler(req, res) {
  const ncco = [
    {
      action: "talk",
      text: "Hello, your verification call has started."
    }
  ];
  res.status(200).json(ncco);
}
