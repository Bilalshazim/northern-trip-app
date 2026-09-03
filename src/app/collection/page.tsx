"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Users, UserRound, X } from "lucide-react";
import { useTrip } from "@/lib/TripContext";
import {
  PAYMENT_MODES,
  PaymentMode,
  REFERENCE_TYPES,
  ReferenceType,
  Person,
} from "@/types/trip";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";

const REFERENCE_STYLES: Record<ReferenceType, string> = {
  Advance: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  Remaining: "bg-teal-500/15 text-teal-300 border-teal-400/30",
};

function emptyForm() {
  return {
    name: "",
    amount: "",
    date: todayISO(),
    paymentMode: "Cash" as PaymentMode,
    reference: "Advance" as ReferenceType,
  };
}

export default function CollectionPage() {
  const { people, addPerson, updatePerson, deletePerson, totalCollected } = useTrip();

  const [form, setForm] = useState(emptyForm());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openForCreate = () => {
    if (formOpen && editingId === null) {
      setFormOpen(false);
      return;
    }
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openForEdit = (person: Person) => {
    setEditingId(person.id);
    setForm({
      name: person.name,
      amount: String(person.amount),
      date: person.date,
      paymentMode: person.paymentMode,
      reference: person.reference,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(form.amount);
    if (!form.name.trim() || !numericAmount || numericAmount <= 0) return;

    const payload = {
      name: form.name.trim(),
      amount: numericAmount,
      date: form.date,
      paymentMode: form.paymentMode,
      reference: form.reference,
    };

    if (editingId) {
      updatePerson(editingId, payload);
    } else {
      addPerson(payload);
    }

    closeForm();
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
          onClick={openForCreate}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-slate-950 shadow-lg shadow-sky-500/30 active:scale-95 transition-transform"
        >
          {formOpen && editingId === null ? (
            <X size={20} strokeWidth={2.5} />
          ) : (
            <Plus size={20} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-300/80">
              {editingId ? "Edit Contribution" : "New Contribution"}
            </span>
            {editingId && (
              <button
                type="button"
                onClick={closeForm}
                className="text-[11px] font-medium text-slate-400"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-sky-400/50 focus:outline-none [color-scheme:dark]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Payment Mode</label>
              <div className="flex flex-col gap-1.5">
                {PAYMENT_MODES.map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setForm((f) => ({ ...f, paymentMode: mode }))}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      form.paymentMode === mode
                        ? "border-sky-400/60 bg-sky-500/20 text-sky-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Reference</label>
              <div className="flex flex-col gap-1.5">
                {REFERENCE_TYPES.map((ref) => (
                  <button
                    type="button"
                    key={ref}
                    onClick={() => setForm((f) => ({ ...f, reference: ref }))}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      form.reference === ref
                        ? "border-violet-400/60 bg-violet-500/20 text-violet-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    {ref}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-transform"
          >
            {editingId ? "Save Changes" : "Add Person"}
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
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                      {p.paymentMode}
                    </span>
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${REFERENCE_STYLES[p.reference]}`}
                    >
                      {p.reference}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">{formatDate(p.date)}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5 pl-2">
                <span className="text-sm font-semibold text-sky-400">
                  {formatCurrency(p.amount)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openForEdit(p)}
                    aria-label="Edit person"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 active:scale-90 transition-transform"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deletePerson(p.id)}
                    aria-label="Delete person"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 active:scale-90 transition-transform"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
