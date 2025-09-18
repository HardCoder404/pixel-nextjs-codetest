import { getServerSession } from "@/lib/auth";
import { getWorkOrder, getUsers } from "@/lib/actions/orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Label } from "@/components/ui/label";
import { OrderEditForm } from "@/components/orders/order-edit-form";
import { WorkOrder } from "@/types";
import { normalizeUsers, normalizeWorkOrder } from "@/lib/typeGuards";

interface PageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <h1 className="text-xl font-semibold">Not signed in</h1>
          <p className="mt-2">
            Please{" "}
            <Link href="/login" className="underline">
              sign in
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  try {
    const order = await getWorkOrder(params.id);
    console.log("ORDER: ",order);
    
    const users = session.user.role === "MANAGER" ? await getUsers() : [];
    const normalizedOrder = normalizeWorkOrder(order);
    const normalizedUsers = normalizeUsers(users);



    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Order Details</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrderEditForm
              order={normalizedOrder}
              users={normalizedUsers}
              userRole={session.user.role}
            />
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className="ml-2">
                    {order.status.replace("_", " ")}
                  </Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge
                    className="ml-2"
                    variant={
                      order.priority === "HIGH"
                        ? "destructive"
                        : order.priority === "MED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {order.priority}
                  </Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium">Created by</Label>
                  <p className="text-sm text-muted-foreground">
                    {order.createdBy?.email}
                  </p>
                </div>

                {order.assignedTo && (
                  <div>
                    <Label className="text-sm font-medium">Assigned to</Label>
                    <p className="text-sm text-muted-foreground">
                      {order.assignedTo.email}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.createdAt))} ago
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Last updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.updatedAt))} ago
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <h1 className="text-xl font-semibold text-destructive">Error</h1>
          <p className="mt-2">Order not found or access denied.</p>
          <Button asChild className="mt-4">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
}
