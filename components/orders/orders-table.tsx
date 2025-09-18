"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Eye, Edit, User, Calendar, Clock, AlertCircle } from "lucide-react";
import type { WorkOrder } from "@/types";
import { OrdersPagination } from "./orders-pagination";

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
  console.log("ROLE KYA H TERA: ",userRole);
  

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MED":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "outline";
      case "IN_PROGRESS":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityIcon = (priority: string) => {
    const baseClass = "w-2 h-2 rounded-full";
    switch (priority) {
      case "HIGH":
        return <div className={`${baseClass} bg-red-500`} />;
      case "MED":
        return <div className={`${baseClass} bg-yellow-500`} />;
      case "LOW":
        return <div className={`${baseClass} bg-green-500`} />;
      default:
        return <div className={`${baseClass} bg-gray-500`} />;
    }
  };

  const getStatusIcon = (status: string) => {
    const baseClass = "w-2 h-2 rounded-full";
    switch (status) {
      case "OPEN":
        return <div className={`${baseClass} bg-blue-500`} />;
      case "IN_PROGRESS":
        return <div className={`${baseClass} bg-orange-500`} />;
      case "COMPLETED":
        return <div className={`${baseClass} bg-green-500`} />;
      case "CANCELLED":
        return <div className={`${baseClass} bg-red-500`} />;
      default:
        return <div className={`${baseClass} bg-gray-500`} />;
    }
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="text-base">
          <TableRow>
            <TableHead className="w-[300px]">Order Details</TableHead>
            <TableHead className="w-[120px]">Priority</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[200px]">Created By</TableHead>
            {userRole === "MANAGER" && (
              <TableHead className="w-[200px]">Assigned To</TableHead>
            )}
            <TableHead className="w-[150px]">Created</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="group hover:bg-muted/50">
              {/* Order Details */}
              <TableCell className="py-4">
                <div className="space-y-1">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-medium text-sm hover:underline hover:text-primary transition-colors"
                  >
                    {truncateText(order.title, 50)}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {truncateText(order.description, 80)}
                  </p>
                </div>
              </TableCell>

              {/* Priority */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {getPriorityIcon(order.priority)}
                  <Badge
                    variant={getPriorityColor(order.priority)}
                    className="text-xs"
                  >
                    {order.priority}
                  </Badge>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Badge
                    variant={getStatusColor(order.status)}
                    className="text-xs"
                  >
                    {order.status.replace("_", " ")}
                  </Badge>
                </div>
              </TableCell>

              {/* Created By */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <div className="text-xs">
                    <p className="font-medium">
                      {order.createdBy?.email || "Unknown"}
                    </p>
                    <p className="text-muted-foreground">
                      {order.createdBy?.role?.toLowerCase() || "user"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Assigned To (Manager only) */}
              {userRole === "MANAGER" && (
                <TableCell>
                  {order.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.assignedTo.role === "MANAGER"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <div className="text-xs">
                        <p className="font-medium">{order.assignedTo.email}</p>
                        <p className="text-muted-foreground">
                          {order.assignedTo.role?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <span className="text-xs">Unassigned</span>
                    </div>
                  )}
                </TableCell>
              )}

              {/* Created Date */}
              <TableCell>
                <div className="items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(order.createdAt))} ago
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    // className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View order</span>
                    </Link>
                  </Button>

                  {(userRole === "MANAGER" ||
                    order.createdById === order.createdBy?.id) && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      // className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link href={`/orders/${order.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit order</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
