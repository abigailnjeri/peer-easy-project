import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

const NAV = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "users", label: "User Management", icon: "👥" },
];
const card = "bg-white rounded-2xl shadow-sm border border-midnight/5 p-6";

const ROLE_TONE = {
  student: "bg-bluegrey/10 text-midnight font-medium",
  lecturer: "bg-coral/20 text-terracotta font-medium",
  admin: "bg-terracotta/10 text-terracotta font-medium",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  let me = {};
  try {
    me = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    me = {};
  }

  const flash = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      const [s, u] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);
      setStats(s.data);
      setUsers(u.data);
    } catch (err) {
      flash("Could not load admin data", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      flash("Role updated");
      loadData();
    } catch (err) {
      flash(err.response?.data?.message || "Could not update role", "error");
    }
  };

  const filtered = users.filter((u) =>
    `${u.full_name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const total = stats?.users || 0;
  const bar = (n) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <Layout
      nav={NAV}
      active={tab}
      onNav={setTab}
      title="Administrator Dashboard"
      subtitle="Platform overview, users and access control"
    >
      {message && (
        <div
          className={`text-sm p-3.5 rounded-lg mb-6 font-medium border ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-emerald-50 text-emerald-700 border-emerald-100"
          }`}
        >
          {message.text}
        </div>
      )}

      {tab === "overview" && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              label="Total users"
              value={stats.users}
              icon="👥"
              tone="bluegrey"
            />
            <StatCard
              label="Courses"
              value={stats.courses}
              icon="📚"
              tone="terracotta"
            />
            <StatCard
              label="Assignments"
              value={stats.assignments}
              icon="📝"
              tone="coral"
            />
            <StatCard
              label="Submissions"
              value={stats.submissions}
              icon="📥"
              tone="terracotta"
            />
            <StatCard
              label="Reviews done"
              value={stats.reviews}
              icon="✅"
              tone="midnight"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={card}>
              <h2 className="font-bold text-lg text-midnight mb-5">
                Users by role
              </h2>
              <div className="space-y-5">
                {[
                  ["Students", stats.students, "bg-bluegrey"],
                  ["Lecturers", stats.lecturers, "bg-coral"],
                  ["Admins", stats.admins, "bg-terracotta"],
                ].map(([label, n, barColor]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5 font-medium text-midnight">
                      <span>{label}</span>
                      <span>{n}</span>
                    </div>
                    <div className="h-2.5 bg-cream rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${bar(n)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={card}>
              <h2 className="font-bold text-lg text-midnight mb-5">
                Newest users
              </h2>
              <div className="space-y-4">
                {users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between text-sm border-b border-cream pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-midnight">
                        {u.full_name}
                      </p>
                      <p className="text-xs text-bluegrey mt-0.5">{u.email}</p>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full capitalize ${ROLE_TONE[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className={card}>
          <div className="mb-6">
            <input
              placeholder="Search by name, email or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border border-bluegrey/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors bg-cream/30 focus:bg-white"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-bluegrey uppercase tracking-wider border-b border-cream">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Joined</th>
                  <th className="pb-3 font-semibold text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-cream/30 transition-colors"
                  >
                    <td className="py-3.5 font-medium text-midnight">
                      {u.full_name}
                    </td>
                    <td className="text-bluegrey">{u.email}</td>
                    <td className="text-bluegrey">
                      {new Date(u.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-right">
                      <select
                        value={u.role}
                        disabled={u.id === me.id}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className={`text-xs rounded-full px-3 py-1.5 border-0 capitalize cursor-pointer focus:ring-2 focus:ring-terracotta focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${ROLE_TONE[u.role]}`}
                      >
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
