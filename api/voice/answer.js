export default function handler(req, res) {
  const code = req.query.code;

  const ncco = [
    {
      action: "talk",
      text: "Hello. Your verification call is starting now."
    },
    { action: "pause", length: 1 },

    // Repeat Code Three Times
    {
      action: "talk",
      text: `Your verification code is: ${code}. Please repeat: ${code}.`
    },
    { action: "pause", length: 3 },

    {
      action: "talk",
      text: `Once again, your verification code is: ${code}.`
    },
    { action: "pause", length: 3 },

    {
      action: "talk",
      text: `Final repeat. Your code is: ${code}. Thank you.`
    },
    { action: "pause", length: 10 },

    // Extend call time to approx 2 minutes
    {
      action: "talk",
      text: "We will keep the line active for security confirmation."
    },
    { action: "pause", length: 60 },

    {
      action: "talk",
      text: "This call will now end. Goodbye."
    }
  ];

  res.status(200).json(ncco);
}
