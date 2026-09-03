"use client";

import { useState } from "react";
import { Plus, Trash2, Users, UserRound } from "lucide-react";
import { useTrip } from "@/lib/TripContext";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";

export default function CollectionPage() {
  const { people, addPerson, deletePerson, totalCollected } = useTrip();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!name.trim() || !numericAmount || numericAmount <= 0) return;

    addPerson({
      name: name.trim(),
      amount: numericAmount,
      date,
    });

    setName("");
    setAmount("");
    setDate(todayISO());
    setFormOpen(false);
  };

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Collection</h1>
          <p className="text-xs text-slate-400">
            {formatCurrency(totalCollected)} from {people.length} participants
          </p>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-slate-950 shadow-lg shadow-sky-500/30 active:scale-95 transition-transform"
        >
          <Plus size={20} strokeWidth={2.5} className={formOpen ? "rotate-45 transition-transform" : "transition-transform"} />
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmed Khan"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Amount Contributed (Rs)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-sky-400/50 focus:outline-none [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className="mt-1 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-transform"
          >
            Add Person
          </button>
        </form>
      )}

      <div className="mt-5 flex flex-col gap-2 pb-2">
        {people.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-8 text-center">
            <Users size={22} className="text-slate-600" />
            <p className="text-xs text-slate-500">No participants added yet.</p>
          </div>
        ) : (
          people.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
                  <UserRound size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{p.name}</p>
                  <p className="text-[11px] text-slate-500">{formatDate(p.date)}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 pl-2">
                <span className="text-sm font-semibold text-sky-400">
                  {formatCurrency(p.amount)}
                </span>
                <button
                  onClick={() => deletePerson(p.id)}
                  aria-label="Delete person"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 active:scale-90 transition-transform"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
