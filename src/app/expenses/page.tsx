"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Receipt, ChevronDown } from "lucide-react";
import { useTrip } from "@/lib/TripContext";
import { EXPENSE_CATEGORIES, ExpenseCategory, FOOD_TAGS, FoodTag } from "@/types/trip";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";

const CATEGORY_STYLES: Record<ExpenseCategory, string> = {
  "Bus Tickets": "bg-blue-500/15 text-blue-300 border-blue-400/30",
  Hotel: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  Food: "bg-orange-500/15 text-orange-300 border-orange-400/30",
  Refreshment: "bg-pink-500/15 text-pink-300 border-pink-400/30",
  "Jeep Charges": "bg-lime-500/15 text-lime-300 border-lime-400/30",
  Others: "bg-slate-500/15 text-slate-300 border-slate-400/30",
  Miscellaneous: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
};

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, totalExpenses } = useTrip();

  const [category, setCategory] = useState<ExpenseCategory>("Bus Tickets");
  const [foodTag, setFoodTag] = useState<FoodTag>("Breakfast");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [filter, setFilter] = useState<"All" | ExpenseCategory>("All");
  const [formOpen, setFormOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    if (filter === "All") return expenses;
    return expenses.filter((e) => e.category === filter);
  }, [expenses, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) return;

    addExpense({
      category,
      foodTag: category === "Food" ? foodTag : undefined,
      amount: numericAmount,
      description: description.trim() || undefined,
      date,
    });

    setAmount("");
    setDescription("");
    setDate(todayISO());
    setFormOpen(false);
  };

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Expenses</h1>
          <p className="text-xs text-slate-400">
            {formatCurrency(totalExpenses)} spent across {expenses.length} entries
          </p>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
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
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-amber-400/50 focus:outline-none"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {category === "Food" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Meal</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setFoodTag(tag)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      foodTag === tag
                        ? "border-orange-400/60 bg-orange-500/20 text-orange-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Amount (Rs)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-amber-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Description <span className="text-slate-600">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Hunza Serena stay"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-amber-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-amber-400/50 focus:outline-none [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className="mt-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform"
          >
            Add Expense
          </button>
        </form>
      )}

      {/* Category filter */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(["All", ...EXPENSE_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === c
                ? "border-amber-400/60 bg-amber-500/20 text-amber-300"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 flex flex-col gap-2 pb-2">
        {filteredExpenses.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-8 text-center">
            <Receipt size={22} className="text-slate-600" />
            <p className="text-xs text-slate-500">No expenses logged yet.</p>
          </div>
        ) : (
          filteredExpenses.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_STYLES[e.category]}`}
                  >
                    {e.category === "Food" && e.foodTag ? `${e.category} · ${e.foodTag}` : e.category}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-200">
                  {e.description || "—"}
                </p>
                <p className="text-[11px] text-slate-500">{formatDate(e.date)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 pl-2">
                <span className="text-sm font-semibold text-amber-400">
                  {formatCurrency(e.amount)}
                </span>
                <button
                  onClick={() => deleteExpense(e.id)}
                  aria-label="Delete expense"
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
