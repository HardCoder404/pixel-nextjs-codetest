import type { WorkOrder, User } from "@/types";

const VALID_PRIORITIES = ["LOW", "MED", "HIGH"] as const;
const VALID_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
const VALID_ROLES = ["USER", "MANAGER"] as const;

function isValidPriority(priority: string): priority is WorkOrder["priority"] {
  return VALID_PRIORITIES.includes(priority as any);
}

function isValidStatus(status: string): status is WorkOrder["status"] {
  return VALID_STATUSES.includes(status as any);
}

function isValidRole(role: string): role is User["role"] {
  return VALID_ROLES.includes(role as any);
}

export function normalizeUser(user: any): User {
  return {
    ...user,
    role: isValidRole(user.role) ? user.role : "USER",
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
  };
}

export function normalizeUsers(users: any[]): User[] {
  return users.map(normalizeUser);
}

export function normalizeWorkOrder(order: any): WorkOrder {
  return {
    ...order,
    priority: isValidPriority(order.priority) ? order.priority : "MED",
    status: isValidStatus(order.status) ? order.status : "OPEN",
    createdAt: new Date(order.createdAt),
    updatedAt: new Date(order.updatedAt),
    // Normalize nested user objects if they exist
    createdBy: order.createdBy ? normalizeUser(order.createdBy) : undefined,
    assignedTo: order.assignedTo ? normalizeUser(order.assignedTo) : null,
  };
}
