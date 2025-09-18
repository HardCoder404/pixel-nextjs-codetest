import { z } from "zod";

export const createWorkOrderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  priority: z.enum(["LOW", "MED", "HIGH"]).default("MED"),
});

export const updateWorkOrderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long")
    .optional(),
  priority: z.enum(["LOW", "MED", "HIGH"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  assignedToId: z.string().nullable().optional(),
});

export const searchFiltersSchema = z.object({
  search: z.string().optional().default(""),
  status: z.string().optional().default(""),
  priority: z.string().optional().default(""),
  page: z.coerce.number().min(1).optional().default(1),
});
