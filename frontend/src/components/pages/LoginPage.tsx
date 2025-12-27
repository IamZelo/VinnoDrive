import { useState, useEffect, type FormEvent } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { GridLoader } from "react-spinners";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If already login redirect to home
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token && token != undefined) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError(null);
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/user/token/obtain/", { username, password });

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/", { replace: true });
    } catch (error: any) {
      // Handle specific error messages from Django if available
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 transition-colors duration-300 bg-gray-50 dark:bg-zinc-950">
      {/* LOGIN CARD */}
      {/* Light: White + Shadow | Dark: zinc-900 + Border (Shadows are invisible in dark mode, borders define edges) */}
      <div
        className="w-full max-w-md rounded-2xl shadow-xl transition-all duration-300 
                      bg-white dark:bg-zinc-900 
                      border border-transparent dark:border-zinc-800"
      >
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              Please sign in to your VinnoDrive account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="mb-6 rounded-lg p-4 text-sm font-medium
                          bg-red-50 text-red-600 border border-red-100
                          dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="block w-full rounded-xl px-4 py-2.5 text-sm transition-colors
                           border border-gray-200 bg-white text-gray-900 placeholder-gray-400
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                           dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500
                           dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-xl px-4 py-2.5 text-sm transition-colors
                           border border-gray-200 bg-white text-gray-900 placeholder-gray-400
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                           dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500
                           dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
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
                {loading ? <GridLoader size={6} color="white" /> : "Sign in"}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-zinc-400">
            <div className="mt-2">
              <Link
                to="/reset-password"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
