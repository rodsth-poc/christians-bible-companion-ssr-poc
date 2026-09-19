"use client";

import { useState } from "react";

export default function AuthPocPage() {
  const [accessCode, setAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");

  const [email, setEmail] = useState("");
  const [otpId, setOtpId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  async function handleAccessSubmit(event) {
    event.preventDefault();
    setAccessMessage("");

    const response = await fetch("/api/auth-poc/authorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      setAccessGranted(false);
      setAccessMessage(data.error || "Invalid access code.");
      return;
    }

    setAccessGranted(true);
    setAccessMessage("Access granted. Authentication testing is ready.");
  }

  async function handleRequestOtp(event) {
    event.preventDefault();
    setOtpMessage("");
    setRequestingOtp(true);

    try {
      const response = await fetch("/api/auth-poc/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpMessage(data.error || "Unable to request OTP.");
        return;
      }

      setOtpId(data.otpId || "");
      setOtpMessage(data.message || "OTP request submitted.");
    } catch (error) {
      setOtpMessage("Unable to contact the authentication test endpoint.");
    } finally {
      setRequestingOtp(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setOtpMessage("");
    setVerifyingOtp(true);

    try {
      const response = await fetch("/api/auth-poc/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otpId,
          otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpMessage(data.error || "Unable to verify OTP.");
        return;
      }

      setOtpMessage(data.message || "OTP verification successful.");
    } catch (error) {
      setOtpMessage("Unable to contact the authentication test endpoint.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  return (
    <main style={{ maxWidth: "640px", margin: "40px auto", padding: "20px" }}>
      <h1>CBC PocketBase Auth POC</h1>

      <p>This is a protected authentication test.</p>

      {!accessGranted ? (
        <form onSubmit={handleAccessSubmit}>
          <label htmlFor="accessCode">POC Access Code</label>

          <input
            id="accessCode"
            type="password"
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              margin: "8px 0 16px",
            }}
          />

          <button type="submit">Continue</button>

          {accessMessage && <p>{accessMessage}</p>}
        </form>
      ) : (
        <>
          <p>{accessMessage}</p>

          <form onSubmit={handleRequestOtp}>
            <label htmlFor="email">CBC Account Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                margin: "8px 0 16px",
              }}
            />

            <button type="submit" disabled={requestingOtp}>
              {requestingOtp ? "Requesting OTP..." : "Request OTP"}
            </button>

            {otpMessage && !otpId && <p>{otpMessage}</p>}
          </form>

          {otpId && (
            <form onSubmit={handleVerifyOtp} style={{ marginTop: "24px" }}>
              <label htmlFor="otpCode">8-Digit OTP</label>

              <input
                id="otpCode"
                type="text"
                inputMode="numeric"
                maxLength="8"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                required
                style={{
                  display: "block",
                  width: "100%",
                  margin: "8px 0 16px",
                }}
              />

              <button type="submit" disabled={verifyingOtp}>
                {verifyingOtp ? "Verifying OTP..." : "Verify OTP"}
              </button>

              {otpMessage && <p>{otpMessage}</p>}
            </form>
          )}

          <p>Access granted.</p>
        </>
      )}
    </main>
  );
}
```
