export interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "MANAGER";
  createdAt?: Date;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MED" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdById: string;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User;
  assignedTo?: User | null;
  imageUrl?: string | null;
  imageName?: string | null;
}

export interface OrderFilters {
  search: string;
  status: string;
  priority: string;
  page: number;
}

export interface PaginatedOrders {
  orders: WorkOrder[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
