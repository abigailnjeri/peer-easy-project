import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";
import redirectByRole from "../utils/redirectByRole";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(redirectByRole(res.data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to PeerEasy">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-midnight mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            placeholder="student@peereasy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-semibold text-midnight mb-1.5 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-terracotta text-white py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition-colors shadow-sm shadow-terracotta/20"
        >
          Log In
        </button>
        <p className="text-sm text-center mt-6 text-bluegrey">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-terracotta font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
