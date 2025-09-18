import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Eye, Edit, User, Calendar, Clock } from "lucide-react";
import type { WorkOrder } from "@/types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants/editOrder";

interface TableRowProps {
  order: WorkOrder;
  userRole: "USER" | "MANAGER";
}

export function TableRowComponent({ order, userRole }: TableRowProps) {
  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getPriorityIcon = (priority: string) => {
    const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG];
    return (
      <div
        className={`w-2 h-2 rounded-full ${config?.color || "bg-gray-500"}`}
      />
    );
  };

  const getStatusIcon = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    return (
      <div
        className={`w-2 h-2 rounded-full ${config?.color || "bg-gray-500"}`}
      />
    );
  };

  const renderAssignedTo = () => {
    if (order.assignedTo) {
      return (
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
      );
    }
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <span className="text-xs">Unassigned</span>
      </div>
    );
  };

  const renderActions = () => {
    const canEdit =
      userRole === "MANAGER" || order.createdById === order.createdBy?.id;

    return (
      <div className="flex items-center justify-end">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/orders/${order.id}`}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">View order</span>
          </Link>
        </Button>
        {canEdit && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/orders/${order.id}`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit order</span>
            </Link>
          </Button>
        )}
      </div>
    );
  };

  return (
    <TableRow className="group hover:bg-muted/50">
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
            variant={
              PRIORITY_CONFIG[order.priority as keyof typeof PRIORITY_CONFIG]
                ?.variant || "default"
            }
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
            variant={
              STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                ?.variant || "default"
            }
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
            <p className="font-medium">{order.createdBy?.email || "Unknown"}</p>
            <p className="text-muted-foreground">
              {order.createdBy?.role?.toLowerCase() || "user"}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Assigned To (Manager only) */}
      {userRole === "MANAGER" && <TableCell>{renderAssignedTo()}</TableCell>}

      {/* Created Date */}
      <TableCell>
        <div className="items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(order.createdAt))} ago</span>
          </div>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">{renderActions()}</TableCell>
    </TableRow>
  );
}
