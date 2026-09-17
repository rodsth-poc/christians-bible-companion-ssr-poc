'use client';

import { useState } from 'react';

export default function AuthPocPage() {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState('');

  async function handleAccessCodeSubmit(event) {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/auth-poc/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessCode }),
    });

    if (!response.ok) {
      setMessage('Invalid access code.');
      return;
    }

    setAuthorized(true);
    setMessage('Access granted.');
  }

  if (!authorized) {
    return (
      <main>
        <h1>CBC PocketBase Auth POC</h1>

        <p>This is a protected authentication test.</p>

        <form onSubmit={handleAccessCodeSubmit}>
          <label htmlFor="accessCode">POC Access Code</label>
          <br />
          <input
            id="accessCode"
            type="password"
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            required
          />
          <br />
          <br />
          <button type="submit">Continue</button>
        </form>

        {message && <p>{message}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>CBC PocketBase Auth POC</h1>

      <p>Access granted. Authentication testing is ready.</p>

      <form>
        <label htmlFor="email">CBC Account Email</label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <br />
        <br />
        <button type="button" disabled>
          Request OTP
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
