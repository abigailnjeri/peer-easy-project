import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";
import redirectByRole from "../utils/redirectByRole";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(redirectByRole(res.data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Join PeerEasy to submit and review projects"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-midnight mb-1.5 uppercase tracking-wide">
            Full Name
          </label>
          <input
            name="full_name"
            placeholder="Jane Doe"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-midnight mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="jane@peereasy.com"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-midnight mb-1.5 uppercase tracking-wide">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-semibold text-midnight mb-1.5 uppercase tracking-wide">
            I am a...
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-terracotta text-white py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition-colors shadow-sm shadow-terracotta/20"
        >
          Sign Up
        </button>
        <p className="text-sm text-center mt-6 text-bluegrey">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-terracotta font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
