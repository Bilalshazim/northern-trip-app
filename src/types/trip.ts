export type ExpenseCategory =
  | "Bus Tickets"
  | "Hotel"
  | "Food"
  | "Refreshment"
  | "Jeep Charges"
  | "Others"
  | "Miscellaneous";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Bus Tickets",
  "Hotel",
  "Food",
  "Refreshment",
  "Jeep Charges",
  "Others",
  "Miscellaneous",
];

export type FoodTag = "Breakfast" | "Lunch" | "Dinner" | "Tea";

export const FOOD_TAGS: FoodTag[] = ["Breakfast", "Lunch", "Dinner", "Tea"];

export type PaymentMode = "Cash" | "Bank Transfer";

export const PAYMENT_MODES: PaymentMode[] = ["Cash", "Bank Transfer"];

export type ReferenceType = "Advance" | "Remaining";

export const REFERENCE_TYPES: ReferenceType[] = ["Advance", "Remaining"];

export interface Expense {
  id: string;
  category: ExpenseCategory;
  foodTag?: FoodTag;
  amount: number;
  description?: string;
  date: string; // ISO date string
  paymentMode: PaymentMode;
  reference: ReferenceType;
  createdAt: number;
}

export interface Person {
  id: string;
  name: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  reference: ReferenceType;
  createdAt: number;
}
