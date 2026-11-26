export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-cream font-sans">
      {/* Left Pane - Brand Info */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-midnight text-white p-12 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-terracotta opacity-10 blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-terracotta flex items-center justify-center font-bold text-lg shadow-lg">
            P
          </div>
          <span className="text-xl font-semibold tracking-wide">PeerEasy</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight mb-6 text-cream">
            Fair, anonymous peer review — in one place.
          </h2>
          <ul className="space-y-4 text-bluegrey text-sm font-medium">
            <li className="flex items-center gap-3">
              <span className="text-coral">📥</span> No more scattered
              submissions
            </li>
            <li className="flex items-center gap-3">
              <span className="text-coral">🕵️</span> Anonymous, rubric-based
              reviews
            </li>
            <li className="flex items-center gap-3">
              <span className="text-coral">📊</span> One clear record of
              feedback
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-bluegrey/70 font-medium tracking-wider uppercase">
          SWE3090A · Student Project Submission
        </p>
      </div>

      {/* Right Pane - Form Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-midnight/5 border border-midnight/5 p-8">
          <h1 className="text-2xl font-bold text-midnight mb-1">{title}</h1>
          <p className="text-sm text-bluegrey mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
