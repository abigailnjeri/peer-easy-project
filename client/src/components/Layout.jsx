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
    <div className="min-h-screen flex bg-cream text-midnight">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-midnight text-cream p-5 print:hidden border-r border-white/5">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-terracotta flex items-center justify-center text-white font-bold shadow-lg">
            P
          </div>
          <div>
            <p className="text-white font-semibold tracking-wide leading-tight">
              PeerEasy
            </p>
            <p className="text-xs text-coral">Peer review made fair</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-200 ${
                active === item.key
                  ? "bg-terracotta text-white shadow-md shadow-terracotta/20"
                  : "text-cream/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-coral text-midnight text-sm font-bold flex items-center justify-center shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate font-medium">
                {user.full_name}
              </p>
              <p className="text-xs text-bluegrey capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-white/5 text-coral hover:text-white transition-colors"
          >
            ⏻ Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile nav) */}
        <div className="md:hidden bg-midnight text-white p-4 print:hidden shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold tracking-wide">PeerEasy</span>
            <button
              onClick={logout}
              className="text-xs text-coral hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {nav.map((item) => (
              <button
                key={item.key}
                onClick={() => onNav(item.key)}
                className={`whitespace-nowrap text-xs px-4 py-1.5 rounded-full transition-colors ${
                  active === item.key
                    ? "bg-terracotta text-white font-medium"
                    : "bg-white/10 text-cream/80 hover:bg-white/20"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-6xl w-full">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-midnight tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-bluegrey mt-1.5 font-medium">
                  {subtitle}
                </p>
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
