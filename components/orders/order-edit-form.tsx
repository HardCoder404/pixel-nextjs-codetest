"use client";

import { useState } from "react";
import { updateWorkOrder } from "@/lib/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { WorkOrder, User } from "@/types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "./constants/editOrder";
import { EditFormFields } from "./edit-order/edit-form-fields";
import { OrderDetails } from "./edit-order/order-details";

interface OrderEditFormProps {
  order: WorkOrder;
  users: User[];
  userRole: "USER" | "MANAGER";
}

export function OrderEditForm({ order, users, userRole }: OrderEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const assignedToId = formData.get("assignedToId");
      if (assignedToId === "unassigned") {
        formData.set("assignedToId", "");
      }

      await updateWorkOrder(order.id, formData);
      setIsEditing(false);
      setSuccessMessage("Order updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Order Information
              <Badge
                variant={
                  PRIORITY_CONFIG[
                    order.priority as keyof typeof PRIORITY_CONFIG
                  ]?.variant || "default"
                }
              >
                {order.priority}
              </Badge>
              <Badge
                variant={
                  STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                    ?.variant || "default"
                }
              >
                {order.status.replace("_", " ")}
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <EditFormFields
              order={order}
              users={users}
              userRole={userRole}
              isEditing={isEditing}
            />

            {/* Submit Button */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <OrderDetails order={order} />
    </div>
  );
}
