import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { WorkOrder } from "@/types";

interface OrderDetailsProps {
  order: WorkOrder;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const details = [
    { label: "Created by", value: order.createdBy?.email || "Unknown" },
    { label: "Order ID", value: order.id, mono: true },
    {
      label: "Created",
      value: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      label: "Last updated",
      value: new Date(order.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {details.map((detail, index) => (
            <div key={index}>
              <Label className="font-medium">{detail.label}</Label>
              <p
                className={`text-muted-foreground mt-1 ${
                  detail.mono ? "font-mono text-xs" : ""
                }`}
              >
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
