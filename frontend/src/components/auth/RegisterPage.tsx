import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import axios from "axios";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError("");
    await sleep(2000);

    // Client-side validation for password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/user/register/", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Handle specific server errors (e.g., duplicate email/username)
        const data = err.response.data;
        const errorMsg = data.email
          ? `Email: ${data.email[0]}`
          : data.username
          ? `Username: ${data.username[0]}`
          : "Registration failed";
        setError(errorMsg);
      } else {
        setError("Connection error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 transition-colors duration-300 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800">
        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              Join VinnoDrive today
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg p-4 text-sm font-medium bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="block w-full rounded-xl px-4 py-2.5 text-sm transition-colors border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="block w-full rounded-xl px-4 py-2.5 text-sm transition-colors border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-xl px-4 py-2.5 text-sm transition-colors border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`block w-full rounded-xl px-4 py-2.5 text-sm transition-colors border ${
                  password && confirmPassword && password !== confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                } bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl px-4 mt-2 text-sm font-bold text-white transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed opacity-70 bg-blue-600"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/20"
              }`}
            >
              <div className="flex items-center justify-center h-full">
                {loading ? <GridLoader size={6} color="white" /> : "Sign Up"}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
