export default async function handler(req, res) {
  const ncco = [
    {
      action: "talk",
      text: "Hello, this is your verification code. Please enter the digits sent to your phone."
    }
  ];
  res.status(200).json(ncco);
}

