"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Expense, Person } from "@/types/trip";

const EXPENSES_KEY = "northern-trip:expenses";
const COLLECTIONS_KEY = "northern-trip:collections";

function loadFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

interface TripContextValue {
  expenses: Expense[];
  people: Person[];
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  deleteExpense: (id: string) => void;
  addPerson: (person: Omit<Person, "id" | "createdAt">) => void;
  deletePerson: (id: string) => void;
  totalCollected: number;
  totalExpenses: number;
  remaining: number;
  isLoaded: boolean;
}

const TripContext = createContext<TripContextValue | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage after mount (browser-only API,
    // deliberately deferred to avoid an SSR/client markup mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenses(loadFromStorage<Expense>(EXPENSES_KEY));
    setPeople(loadFromStorage<Person>(COLLECTIONS_KEY));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(people));
  }, [people, isLoaded]);

  const addExpense = (expense: Omit<Expense, "id" | "createdAt">) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addPerson = (person: Omit<Person, "id" | "createdAt">) => {
    const newPerson: Person = {
      ...person,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setPeople((prev) => [newPerson, ...prev]);
  };

  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const totalCollected = useMemo(
    () => people.reduce((sum, p) => sum + p.amount, 0),
    [people]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const remaining = totalCollected - totalExpenses;

  const value: TripContextValue = {
    expenses,
    people,
    addExpense,
    deleteExpense,
    addPerson,
    deletePerson,
    totalCollected,
    totalExpenses,
    remaining,
    isLoaded,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within a TripProvider");
  return ctx;
}
