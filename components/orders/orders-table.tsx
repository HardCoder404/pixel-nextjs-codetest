"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import type { WorkOrder } from "@/types";
import { OrdersPagination } from "./orders-pagination";
import { TableRowComponent } from "./order-table/table-row";

interface OrdersTableProps {
  orders: WorkOrder[];
  userRole: "USER" | "MANAGER";
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
}

export function OrdersTable({
  orders,
  userRole,
  currentPage = 1,
  totalPages = 1,
  totalCount = orders.length,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            {userRole === "MANAGER"
              ? "No work orders match your current filters."
              : "You haven't created any work orders yet."}
          </p>
          <Button asChild>
            <Link href="/orders/new">Create your first order</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getTableHeaders = () => {
    const baseHeaders = [
      { key: "details", label: "Order Details", width: "w-[300px]" },
      { key: "priority", label: "Priority", width: "w-[120px]" },
      { key: "status", label: "Status", width: "w-[120px]" },
      { key: "created", label: "Created By", width: "w-[200px]" },
    ];

    if (userRole === "MANAGER") {
      baseHeaders.push({
        key: "assigned",
        label: "Assigned To",
        width: "w-[200px]",
      });
    }

    baseHeaders.push(
      { key: "date", label: "Created", width: "w-[150px]" },
      { key: "actions", label: "Actions", width: "w-[100px] text-right" }
    );

    return baseHeaders;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="text-base">
          <TableRow>
            {getTableHeaders().map((header) => (
              <TableHead key={header.key} className={header.width}>
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRowComponent
              key={order.id}
              order={order}
              userRole={userRole}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
