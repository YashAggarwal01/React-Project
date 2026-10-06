export const generateUUID = () => crypto.randomUUID();

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Puter rejects with plain objects like { error: { message } }, not Error instances
export function getErrorMessage(err: any): string {
  if (typeof err === "string") return err;
  return (
    err?.error?.message ||
    (typeof err?.error === "string" ? err.error : "") ||
    err?.message ||
    "Something went wrong, please try again"
  );
}