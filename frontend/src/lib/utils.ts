import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Role } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function canAccess(userRole: Role | undefined, allowed: Role[]) {
  return Boolean(userRole && allowed.includes(userRole));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
