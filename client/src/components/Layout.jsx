import { useNavigate } from "react-router-dom";

export default function Layout({
  nav,
  active,
  onNav,
  title,
  subtitle,
  actions,
  children,
}) {
  const navigate = useNavigate();
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }
  const initials = (user.full_name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-slate-300 p-5 print:hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg">
            P
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">PeerEasy</p>
            <p className="text-xs text-slate-400">Peer review made fair</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
                active === item.key
                  ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-900/40"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{user.full_name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-white/10 text-rose-300"
          >
            ⏻ Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {/* Top bar (mobile nav) */}
        <div className="md:hidden bg-slate-900 text-white p-3 print:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">PeerEasy</span>
            <button onClick={logout} className="text-xs text-rose-300">
              Log out
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {nav.map((item) => (
              <button
                key={item.key}
                onClick={() => onNav(item.key)}
                className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full ${active === item.key ? "bg-indigo-600" : "bg-white/10"}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            <div className="print:hidden">{actions}</div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
