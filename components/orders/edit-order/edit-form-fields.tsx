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
import type { WorkOrder, User } from "@/types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants/editOrder";

interface EditFormFieldsProps {
  order: WorkOrder;
  users: User[];
  userRole: "USER" | "MANAGER";
  isEditing: boolean;
}

export function EditFormFields({
  order,
  users,
  userRole,
  isEditing,
}: EditFormFieldsProps) {
  const renderField = (
    label: string,
    value: any,
    name?: string,
    type?: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {isEditing ? (
        type === "textarea" ? (
          <Textarea
            name={name}
            defaultValue={value}
            rows={4}
            required
            className="w-full resize-none"
          />
        ) : (
          <Input name={name} defaultValue={value} required className="w-full" />
        )
      ) : (
        <div
          className={`p-3 bg-gray-50 rounded-md border ${
            type === "textarea" ? "min-h-[100px]" : ""
          }`}
        >
          <p
            className={`text-sm ${
              type === "textarea" ? "whitespace-pre-wrap" : ""
            }`}
          >
            {value}
          </p>
        </div>
      )}
    </div>
  );

  const renderSelectField = (
    label: string,
    name: string,
    currentValue: any,
    options: any[]
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {isEditing ? (
        <Select name={name} defaultValue={currentValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.color && (
                    <div className={`w-2 h-2 rounded-full ${option.color}`} />
                  )}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="p-3 bg-gray-50 rounded-md border">
          <div className="flex items-center gap-2">
            {options.find((o) => o.value === currentValue)?.color && (
              <div
                className={`w-2 h-2 rounded-full ${
                  options.find((o) => o.value === currentValue)?.color
                }`}
              />
            )}
            <p className="text-sm">
              {options.find((o) => o.value === currentValue)?.label ||
                currentValue}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const priorityOptions = Object.entries(PRIORITY_CONFIG).map(
    ([key, config]) => ({
      value: key,
      label: config.label,
      color: config.color,
    })
  );

  const statusOptions = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    color: config.color,
  }));

  const userOptions = [
    { value: "unassigned", label: "Unassigned", color: null },
    ...users.map((user) => ({
      value: user.id,
      label: `${user.email} (${user.role.toLowerCase()})`,
      color: user.role === "MANAGER" ? "bg-purple-500" : "bg-gray-500",
    })),
  ];

  return (
    <>
      {renderField("Title *", order.title, "title")}
      {renderField(
        "Description *",
        order.description,
        "description",
        "textarea"
      )}
      {renderSelectField(
        "Priority",
        "priority",
        order.priority,
        priorityOptions
      )}

      {/* Image */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Order Image</Label>
        {!isEditing ? (
          order.imageUrl ? (
            <div className="space-y-2">
              <img
                src={order.imageUrl}
                alt="Order"
                className="w-48 h-48 object-cover rounded-md border"
              />
              <p className="text-xs text-muted-foreground">{order.imageName}</p>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-md text-center">
              <p className="text-sm text-muted-foreground">No image uploaded</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {order.imageUrl && (
              <div className="space-y-2">
                <p className="text-sm">Current image:</p>
                <img
                  src={order.imageUrl}
                  alt="Current"
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
              Upload new image to replace current one. Leave empty to keep
              existing.
            </p>
          </div>
        )}
      </div>

      {/* Manager only fields */}
      {userRole === "MANAGER" && (
        <>
          {renderSelectField("Status", "status", order.status, statusOptions)}
          {renderSelectField(
            "Assigned To",
            "assignedToId",
            order.assignedToId || "unassigned",
            userOptions
          )}
        </>
      )}
    </>
  );
}
