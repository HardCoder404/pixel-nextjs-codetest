import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { User } from "@/types";
import { FORM_CONFIG, PRIORITY_CONFIG } from "../constants/createOrder";

interface FormFieldsProps {
  formData: {
    title: string;
    description: string;
    priority: "LOW" | "MED" | "HIGH";
    assignedToId: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  users: User[];
  userRole: "USER" | "MANAGER" | undefined;
  isSubmitting: boolean;
}

export function FormFields({
  formData,
  setFormData,
  users,
  userRole,
  isSubmitting,
}: FormFieldsProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Title */}
      <div className="space-y-2">
        <Label>
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          name="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={FORM_CONFIG.TITLE.PLACEHOLDER}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder={FORM_CONFIG.DESCRIPTION.PLACEHOLDER}
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label>
          Priority <span className="text-red-500">*</span>
        </Label>
        <Select
          name="priority"
          value={formData.priority}
          onValueChange={(value: "LOW" | "MED" | "HIGH") =>
            handleChange("priority", value)
          }
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    PRIORITY_CONFIG[formData.priority].color
                  }`}
                />
                {PRIORITY_CONFIG[formData.priority].label}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>Image (Optional)</Label>
        <Input
          name="image"
          type="file"
          accept={FORM_CONFIG.IMAGE.ACCEPT}
          onChange={handleImageSelect}
          disabled={isSubmitting}
        />
        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setImagePreview(null)}
              className="absolute -top-1 -right-1 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Assignee (Manager only) */}
      {userRole === "MANAGER" && (
        <div className="space-y-2">
          <Label>Assign To</Label>
          <Select
            name="assignedToId"
            value={formData.assignedToId}
            onValueChange={(value) => handleChange("assignedToId", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Leave unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.email} ({user.role.toLowerCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
