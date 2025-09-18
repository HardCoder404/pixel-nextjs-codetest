"use client";

import { useState } from "react";
import { updateWorkOrder } from "@/lib/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { WorkOrder, User } from "@/types";

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

      // Handle unassigned case - convert "unassigned" back to empty string for backend
      const assignedToId = formData.get("assignedToId");
      if (assignedToId === "unassigned") {
        formData.set("assignedToId", "");
      }

      await updateWorkOrder(order.id, formData);
      setIsEditing(false);
      setSuccessMessage("Order updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Failed to update order:", error);
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
        return "default";
      case "IN_PROGRESS":
        return "default";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Success/Error Messages */}
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Order Information
              <Badge variant={getPriorityColor(order.priority)}>
                {order.priority}
              </Badge>
              <Badge variant={getStatusColor(order.status)}>
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
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              {isEditing ? (
                <Input
                  id="title"
                  name="title"
                  defaultValue={order.title}
                  placeholder="Enter order title"
                  required
                  className="w-full"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm">{order.title}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={order.description}
                  placeholder="Enter order description"
                  rows={4}
                  required
                  className="w-full resize-none"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border min-h-[100px]">
                  <p className="text-sm whitespace-pre-wrap">
                    {order.description}
                  </p>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              {isEditing ? (
                <Select name="priority" defaultValue={order.priority}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="MED">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="HIGH">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        order.priority === "HIGH"
                          ? "bg-red-500"
                          : order.priority === "MED"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <p className="text-sm">{order.priority}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Display/Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Order Image</Label>

              {!isEditing ? (
                // Display mode
                order.imageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={order.imageUrl}
                      alt="Order image"
                      className="w-48 h-48 object-cover rounded-md border"
                    />
                    <p className="text-xs text-muted-foreground">
                      {order.imageName}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      No image uploaded
                    </p>
                  </div>
                )
              ) : (
                // Edit mode - allow image replacement
                <div className="space-y-3">
                  {order.imageUrl && (
                    <div className="space-y-2">
                      <p className="text-sm">Current image:</p>
                      <img
                        src={order.imageUrl}
                        alt="Current order image"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  <Input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="w-full"
                  />

                  <p className="text-xs text-muted-foreground">
                    Upload a new image to replace the current one. Leave empty
                    to keep existing image.
                  </p>
                </div>
              )}
            </div>

            {/* Manager-only fields */}
            {userRole === "MANAGER" && (
              <>
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  {isEditing ? (
                    <Select name="status" defaultValue={order.status}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Open
                          </div>
                        </SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="COMPLETED">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem value="CANCELLED">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            order.status === "OPEN"
                              ? "bg-blue-500"
                              : order.status === "IN_PROGRESS"
                              ? "bg-orange-500"
                              : order.status === "COMPLETED"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <p className="text-sm">
                          {order.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assigned To */}
                <div className="space-y-2">
                  <Label htmlFor="assignedToId" className="text-sm font-medium">
                    Assigned To
                  </Label>
                  {isEditing ? (
                    <Select
                      name="assignedToId"
                      defaultValue={order.assignedToId || "unassigned"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">
                          <span className="text-muted-foreground">
                            Unassigned
                          </span>
                        </SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  user.role === "MANAGER"
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                                }`}
                              ></div>
                              {user.email} ({user.role.toLowerCase()})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {order.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              order.assignedTo.role === "MANAGER"
                                ? "bg-purple-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          <p className="text-sm">
                            {order.assignedTo.email} (
                            {order.assignedTo.role?.toLowerCase()})
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Unassigned
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
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

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-medium">Created by</Label>
              <p className="text-muted-foreground mt-1">
                {order.createdBy?.email || "Unknown"}
              </p>
            </div>

            <div>
              <Label className="font-medium">Order ID</Label>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                {order.id}
              </p>
            </div>

            <div>
              <Label className="font-medium">Created</Label>
              <p className="text-muted-foreground mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <Label className="font-medium">Last updated</Label>
              <p className="text-muted-foreground mt-1">
                {new Date(order.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
