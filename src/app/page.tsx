"use client";

import { Mountain, Wallet, Receipt, TrendingUp, TrendingDown, Users, ListChecks } from "lucide-react";
import { useTrip } from "@/lib/TripContext";
import { MetricCard } from "@/components/MetricCard";
import { formatCurrency, formatDate } from "@/lib/format";

export default function Dashboard() {
  const { totalCollected, totalExpenses, remaining, people, expenses, isLoaded } = useTrip();

  const recentActivity = [
    ...expenses.map((e) => ({
      id: e.id,
      label: e.category,
      sub: e.description || e.foodTag || formatDate(e.date),
      amount: -e.amount,
      createdAt: e.createdAt,
    })),
    ...people.map((p) => ({
      id: p.id,
      label: p.name,
      sub: "Contribution",
      amount: p.amount,
      createdAt: p.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="px-4 pt-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-slate-900 px-5 py-6 shadow-xl shadow-emerald-900/30">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-2 text-emerald-100">
          <Mountain size={18} strokeWidth={2.5} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Northern Areas
          </span>
        </div>
        <h1 className="relative mt-2 text-2xl font-bold text-white">
          Trip Manager
        </h1>
        <p className="relative mt-1 text-sm text-emerald-50/80">
          Track collections and expenses for the whole group, in real time.
        </p>
        <div className="relative mt-4 flex gap-4 text-emerald-50/90">
          <div className="flex items-center gap-1.5 text-xs">
            <Users size={14} />
            <span>{people.length} participants</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <ListChecks size={14} />
            <span>{expenses.length} expenses</span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-5 flex flex-col gap-3">
        <MetricCard
          label="Collected Amount"
          amount={totalCollected}
          icon={Wallet}
          tone="collected"
        />
        <MetricCard
          label="Total Expense Till Now"
          amount={totalExpenses}
          icon={Receipt}
          tone="expense"
        />
        <div
          className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg shadow-black/20 bg-gradient-to-br ${
            remaining >= 0
              ? "from-emerald-500/20 to-teal-600/10 border-emerald-400/30"
              : "from-rose-500/20 to-red-600/10 border-rose-400/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-300/80">
              Remaining Amount
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                remaining >= 0
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {remaining >= 0 ? (
                <TrendingUp size={16} strokeWidth={2.25} />
              ) : (
                <TrendingDown size={16} strokeWidth={2.25} />
              )}
            </div>
          </div>
          <p
            className={`mt-3 text-2xl font-bold tracking-tight ${
              remaining >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatCurrency(remaining)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {remaining >= 0
              ? "Funds are in balance — good to go."
              : "Expenses have exceeded collections."}
          </p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        <h2 className="px-1 text-sm font-semibold text-slate-200">Recent Activity</h2>
        {!isLoaded ? null : recentActivity.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-6 text-center text-xs text-slate-500">
            No activity yet. Add a collection or expense to get started.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">
                    {item.label}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{item.sub}</p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    item.amount >= 0 ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {item.amount >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(item.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
