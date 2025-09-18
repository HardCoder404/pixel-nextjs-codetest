import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriority(priority: string) {
  const priorities = {
    LOW: "Low",
    MED: "Medium",
    HIGH: "High",
  };
  return priorities[priority as keyof typeof priorities] || priority;
}

export function formatStatus(status: string) {
  const statuses = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return statuses[status as keyof typeof statuses] || status;
}
