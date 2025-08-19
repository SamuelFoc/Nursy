"use client";

export function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-white">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-300">{desc}</p>
    </div>
  );
}
