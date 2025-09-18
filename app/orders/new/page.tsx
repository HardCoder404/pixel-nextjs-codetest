import { getServerSession } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import OrderCreateForm from "@/components/orders/order-create-form";

export default async function CreateOrderPage() {
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

  return (
    <OrderCreateForm
      users={[session.user]}
      userRole={session.user.role}
      currentUserId={session.user.id}
    />
  );
}
