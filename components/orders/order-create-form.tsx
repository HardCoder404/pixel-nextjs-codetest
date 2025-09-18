"use client";

import { useState } from "react";
import { createWorkOrder } from "@/lib/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Plus, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { FormFields } from "./create-order/form-fields";
import { HelpCard } from "./create-order/help-card";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MED" as "LOW" | "MED" | "HIGH",
    assignedToId: "unassigned",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const form = new FormData(e.currentTarget);
      form.append("createdById", currentUserId);
      await createWorkOrder(form);
      router.push("/orders");
    } catch (error: any) {
      setError(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

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
        <h1 className="text-2xl font-bold">Create Work Order</h1>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormFields
              formData={formData}
              setFormData={setFormData}
              users={users}
              userRole={userRole}
              isSubmitting={isSubmitting}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button type="submit" disabled={isSubmitting || !isFormValid}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Order"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              * Required fields. Order created with "OPEN" status.
            </p>
          </form>
        </CardContent>
      </Card>

      <HelpCard userRole={userRole} />
    </div>
  );
}
