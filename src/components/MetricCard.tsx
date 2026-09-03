import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface MetricCardProps {
  label: string;
  amount: number;
  icon: LucideIcon;
  tone: "collected" | "expense" | "remaining-positive" | "remaining-negative";
}

const TONE_STYLES: Record<MetricCardProps["tone"], string> = {
  collected:
    "from-sky-500/20 to-blue-600/10 border-sky-400/30 text-sky-300",
  expense:
    "from-amber-500/20 to-orange-600/10 border-amber-400/30 text-amber-300",
  "remaining-positive":
    "from-emerald-500/20 to-teal-600/10 border-emerald-400/30 text-emerald-300",
  "remaining-negative":
    "from-rose-500/20 to-red-600/10 border-rose-400/30 text-rose-300",
};

const ICON_BG: Record<MetricCardProps["tone"], string> = {
  collected: "bg-sky-500/20 text-sky-300",
  expense: "bg-amber-500/20 text-amber-300",
  "remaining-positive": "bg-emerald-500/20 text-emerald-300",
  "remaining-negative": "bg-rose-500/20 text-rose-300",
};

export function MetricCard({ label, amount, icon: Icon, tone }: MetricCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-lg shadow-black/20 ${TONE_STYLES[tone]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-300/80">
          {label}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${ICON_BG[tone]}`}>
          <Icon size={16} strokeWidth={2.25} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-white">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
