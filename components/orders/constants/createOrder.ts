// Priority Configuration
export const PRIORITY_CONFIG: Record<
  "LOW" | "MED" | "HIGH",
  { label: string; color: string; description: string }
> = {
  LOW: {
    label: "Low Priority",
    color: "bg-green-500",
    description: "Non-urgent, can be scheduled",
  },
  MED: {
    label: "Medium Priority",
    color: "bg-yellow-500",
    description: "Normal priority, complete soon",
  },
  HIGH: {
    label: "High Priority",
    color: "bg-red-500",
    description: "Urgent, needs immediate attention",
  },
};

// Form Configuration
export const FORM_CONFIG = {
  TITLE: {
    PLACEHOLDER: "Enter a descriptive title for the work order",
    HELP_TEXT: "Be specific and clear about what needs to be done",
  },
  DESCRIPTION: {
    PLACEHOLDER:
      "Provide detailed information about the work to be performed, including any special requirements, materials needed, or safety considerations...",
    HELP_TEXT:
      "Include all relevant details that will help the assignee understand and complete the work",
  },
  IMAGE: {
    ACCEPT: "image/jpeg,image/png,image/webp",
    HELP_TEXT: "JPEG, PNG, or WebP. Maximum 5MB.",
  },
  TIPS: [
    "Use clear, specific titles that describe the work needed",
    "Include all relevant details in the description",
    "Set appropriate priority levels based on urgency",
    "Consider safety requirements and necessary materials",
  ],
};

// Status Configuration
export const STATUS_CONFIG = {
  OPEN: { label: "Open", color: "bg-blue-500" },
  IN_PROGRESS: { label: "In Progress", color: "bg-yellow-500" },
  COMPLETED: { label: "Completed", color: "bg-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-red-500" },
};

// Role Configuration
export const ROLE_CONFIG = {
  USER: { label: "User", color: "bg-gray-500" },
  MANAGER: { label: "Manager", color: "bg-purple-500" },
};
