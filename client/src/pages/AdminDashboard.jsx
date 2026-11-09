import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

const NAV = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "users", label: "User Management", icon: "👥" },
];
const card = "bg-white rounded-2xl shadow-sm border border-slate-100 p-5";
const ROLE_TONE = {
  student: "bg-indigo-50 text-indigo-700",
  lecturer: "bg-amber-50 text-amber-700",
  admin: "bg-rose-50 text-rose-700",
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
          className={`text-sm p-3 rounded-lg mb-5 ${message.type === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}
        >
          {message.text}
        </div>
      )}

      {tab === "overview" && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              label="Total users"
              value={stats.users}
              icon="👥"
              tone="indigo"
            />
            <StatCard
              label="Courses"
              value={stats.courses}
              icon="📚"
              tone="pink"
            />
            <StatCard
              label="Assignments"
              value={stats.assignments}
              icon="📝"
              tone="amber"
            />
            <StatCard
              label="Submissions"
              value={stats.submissions}
              icon="📥"
              tone="green"
            />
            <StatCard
              label="Reviews done"
              value={stats.reviews}
              icon="✅"
              tone="slate"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className={card}>
              <h2 className="font-semibold mb-4">Users by role</h2>
              {[
                ["Students", stats.students, "from-indigo-500 to-violet-500"],
                ["Lecturers", stats.lecturers, "from-amber-500 to-orange-500"],
                ["Admins", stats.admins, "from-rose-500 to-pink-500"],
              ].map(([label, n, grad]) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{label}</span>
                    <span>{n}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${grad}`}
                      style={{ width: `${bar(n)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={card}>
              <h2 className="font-semibold mb-4">Newest users</h2>
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{u.full_name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full capitalize ${ROLE_TONE[u.role]}`}
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
          <input
            placeholder="Search by name, email or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-3 font-medium">{u.full_name}</td>
                    <td className="text-slate-500">{u.email}</td>
                    <td className="text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        value={u.role}
                        disabled={u.id === me.id}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className={`text-xs rounded-full px-2.5 py-1 border-0 capitalize ${ROLE_TONE[u.role]} disabled:opacity-60`}
                      >
                        <option value="student">student</option>
                        <option value="lecturer">lecturer</option>
                        <option value="admin">admin</option>
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
