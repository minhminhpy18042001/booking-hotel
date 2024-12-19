import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetLink } from '../api-client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sendPasswordResetLink(email); // Assuming you have an email state variable
      setMessage('A password reset link has been sent to your email address.');
    } catch (error) {
      setMessage('Failed to send password reset link. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 w-full"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default ForgotPassword;