"use client";

import { useEffect, useState } from "react";
import { Mountain, Delete } from "lucide-react";

const PIN = "6059";
const PIN_LENGTH = 4;
const STORAGE_KEY = "northern-trip:unlocked";
const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(window.sessionStorage.getItem(STORAGE_KEY) === "true");
    setChecked(true);
  }, []);

  const handleKey = (key: string) => {
    if (error || key === "") return;
    if (key === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;

    const nextPin = pin + key;
    setPin(nextPin);
    if (nextPin.length < PIN_LENGTH) return;

    if (nextPin === PIN) {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => {
        setPin("");
        setError(false);
      }, 450);
    }
  };

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+3rem)]">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-900/40">
          <Mountain size={26} strokeWidth={2.5} />
        </div>
        <h1 className="mt-4 text-lg font-bold text-white">Northern Trip</h1>
        <p className="mt-1 text-xs text-slate-400">Enter PIN to continue</p>

        <div className="mt-8 flex gap-4">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full border transition-colors ${
                error
                  ? "border-rose-400 bg-rose-400"
                  : i < pin.length
                    ? "border-emerald-400 bg-emerald-400"
                    : "border-white/20 bg-transparent"
              } ${error ? "animate-pulse" : ""}`}
            />
          ))}
        </div>

        <p className={`mt-3 h-4 text-xs text-rose-400 transition-opacity ${error ? "opacity-100" : "opacity-0"}`}>
          Incorrect PIN
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {KEYPAD_KEYS.map((key, i) =>
            key === "" ? (
              <div key={`blank-${i}`} />
            ) : (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                aria-label={key === "del" ? "Delete" : key}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg font-semibold text-slate-100 active:scale-90 active:bg-white/10 transition-transform"
              >
                {key === "del" ? <Delete size={18} /> : key}
              </button>
            )
          )}
        </div>
      </div>

      <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
        Powered by DevMatrix
      </p>
    </div>
  );
}
