let requestId = null;

async function sendOTP() {
  const phone = document.getElementById("phone").value;

  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone })
  });

  const data = await res.json();

  if (data.request_id) {
    requestId = data.request_id;
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("message").innerText = "OTP sent!";
  } else {
    document.getElementById("message").innerText = "Failed to send OTP";
  }
}

async function verifyOTP() {
  const otp = document.getElementById("otp").value;

  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ requestId, code: otp })
  });

  const data = await res.json();

  if (data.status === "0") {
    document.getElementById("message").innerText = "Phone verified successfully!";
  } else {
    document.getElementById("message").innerText = "Incorrect OTP";
  }
}
