"use client";

import { useState } from "react";

export default function AuthPocPage() {
  const [accessCode, setAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");

  const [email, setEmail] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [requestingOtp, setRequestingOtp] = useState(false);

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

      setOtpMessage(data.message || "OTP request submitted.");
    } catch (error) {
      setOtpMessage("Unable to contact the authentication test endpoint.");
    } finally {
      setRequestingOtp(false);
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
            style={{ display: "block", width: "100%", margin: "8px 0 16px" }}
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
              style={{ display: "block", width: "100%", margin: "8px 0 16px" }}
            />

            <button type="submit" disabled={requestingOtp}>
              {requestingOtp ? "Requesting OTP..." : "Request OTP"}
            </button>

            {otpMessage && <p>{otpMessage}</p>}
          </form>

          <p>Access granted.</p>
        </>
      )}
    </main>
  );
}
