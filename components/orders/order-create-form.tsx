"use client";

import { useState } from "react";
import { createWorkOrder } from "@/lib/actions/orders";
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
import { Save, Plus, AlertCircle, ArrowLeft, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

interface OrderCreateFormProps {
  users: User[];
  userRole: "USER" | "MANAGER" | undefined;
  currentUserId: string;
}

export default function OrderCreateForm({
  users,
  userRole,
  currentUserId,
}: OrderCreateFormProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MED" as "LOW" | "MED" | "HIGH",
    assignedToId: "unassigned", // Empty string ki jagah "unassigned" use karo
  });

  console.log("USER ROLE: ", userRole);
  console.log("USERs: ", users);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const form = new FormData(e.currentTarget);

      // Add the current user as the creator
      form.append("createdById", currentUserId);

      await createWorkOrder(form);

      // Redirect to orders list or show success message
      router.push("/orders");
    } catch (error: any) {
      console.error("Failed to create order:", error);
      setError(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const priorityConfig: Record<
    "LOW" | "MED" | "HIGH",
    { label: string; color: string }
  > = {
    LOW: { label: "Low Priority", color: "bg-green-500" },
    MED: { label: "Medium Priority", color: "bg-yellow-500" },
    HIGH: { label: "High Priority", color: "bg-red-500" },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MED":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Work Order</h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter a descriptive title for the work order"
                required
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Be specific and clear about what needs to be done
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Provide detailed information about the work to be performed, including any special requirements, materials needed, or safety considerations..."
                rows={6}
                required
                className="w-full resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Include all relevant details that will help the assignee
                understand and complete the work
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                name="priority"
                value={formData.priority}
                onValueChange={(value: "LOW" | "MED" | "HIGH") =>
                  handleInputChange("priority", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority level">
                    {formData.priority && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            priorityConfig[formData.priority].color
                          }`}
                        />
                        <span>{priorityConfig[formData.priority].label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex flex-col">
                        <span>Low Priority</span>
                        <span className="text-xs text-muted-foreground">
                          Non-urgent, can be scheduled
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="MED">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="flex flex-col">
                        <span>Medium Priority</span>
                        <span className="text-xs text-muted-foreground">
                          Normal priority, complete soon
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="flex flex-col">
                        <span>High Priority</span>
                        <span className="text-xs text-muted-foreground">
                          Urgent, needs immediate attention
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Order Image (Optional)
              </Label>
              <div className="space-y-3">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  disabled={isSubmitting}
                  className="w-full"
                />

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WebP. Maximum 5MB.
              </p>
            </div>

            {/* Manager-only fields */}
            {userRole === "MANAGER" && (
              <div className="space-y-2">
                <Label htmlFor="assignedToId" className="text-sm font-medium">
                  Assign To
                </Label>
                <Select
                  name="assignedToId"
                  value={formData.assignedToId}
                  onValueChange={(value) =>
                    handleInputChange("assignedToId", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an assignee (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      <span className="text-muted-foreground">
                        Leave unassigned
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
                          <div className="flex flex-col">
                            <span>{user.email}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.role.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  You can assign this order to a specific user or leave it
                  unassigned
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating Order..." : "Create Work Order"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>

            {/* Form Status */}
            <div className="text-xs text-muted-foreground pt-2">
              <p>
                * Required fields. The order will be created with "OPEN" status
                and can be
                {userRole === "MANAGER" ? " assigned and " : " "}
                updated after creation.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-800">
            Tips for Creating Work Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Use clear, specific titles that describe the work needed</li>
            <li>Include all relevant details in the description</li>
            <li>Set appropriate priority levels based on urgency</li>
            <li>Consider safety requirements and necessary materials</li>
            {userRole === "MANAGER" && (
              <li>
                You can assign orders immediately or leave them for later
                assignment
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
