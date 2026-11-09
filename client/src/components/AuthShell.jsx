export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-fuchsia-900 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-lg shadow-lg">
            P
          </div>
          <span className="text-xl font-semibold">PeerEasy</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Fair, anonymous peer review — in one place.
          </h2>
          <ul className="space-y-3 text-slate-200 text-sm">
            <li>
              📥 No more submissions scattered across WhatsApp, email and
              folders
            </li>
            <li>🕵️ Anonymous, rubric-based reviews that reduce bias</li>
            <li>📊 One clear record of every score and comment</li>
          </ul>
        </div>
        <p className="text-xs text-slate-400">
          SWE3090A · Student Project Submission & Peer Review
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
