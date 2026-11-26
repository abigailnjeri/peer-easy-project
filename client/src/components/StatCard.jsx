const TONES = {
  midnight: "bg-midnight/5 text-midnight",
  terracotta: "bg-terracotta/10 text-terracotta",
  coral: "bg-coral/20 text-terracotta",
  bluegrey: "bg-bluegrey/15 text-bluegrey",
  cream: "bg-white text-midnight",
};

export default function StatCard({ label, value, icon, tone = "terracotta" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-5 flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${TONES[tone] || TONES.terracotta}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-midnight leading-none">{value}</p>
        <p className="text-xs text-bluegrey mt-1.5 font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}
