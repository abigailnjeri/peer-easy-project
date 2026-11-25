import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        >
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
