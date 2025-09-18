import { create } from "zustand";
import type { WorkOrder, OrderFilters, PaginatedOrders } from "@/types";

interface OrdersState {
  orders: WorkOrder[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setOrders: (data: PaginatedOrders) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateOrder: (orderId: string, updates: Partial<WorkOrder>) => void;
  addOrder: (order: WorkOrder) => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    search: "",
    status: "",
    priority: "",
    page: 1,
  },
  isLoading: false,
  error: null,

  setOrders: (data) =>
    set({
      orders: data.orders,
      totalCount: data.totalCount,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
    }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  updateOrder: (orderId, updates) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
    })),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      totalCount: state.totalCount + 1,
    })),
}));
