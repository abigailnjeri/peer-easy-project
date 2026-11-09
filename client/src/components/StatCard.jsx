const TONES = {
  indigo: "from-indigo-500 to-violet-500",
  pink: "from-pink-500 to-rose-500",
  green: "from-emerald-500 to-teal-500",
  amber: "from-amber-500 to-orange-500",
  slate: "from-slate-700 to-slate-900",
};

export default function StatCard({ label, value, icon, tone = "indigo" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${TONES[tone]} text-white text-xl flex items-center justify-center shadow`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
