import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { getOrders } from "@/lib/actions/orders";
import { searchFiltersSchema } from "@/lib/validations";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersFilters } from "@/components/orders/orders-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { OrdersPagination } from "@/components/orders/orders-pagination";

interface PageProps {
  searchParams: {
    search?: string;
    status?: string;
    priority?: string;
    page?: string;
  };
}

export default async function OrdersPage({ searchParams }: PageProps) {
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

  const filters = searchFiltersSchema.parse(searchParams);
  console.log("FILTERS: ",filters);
  
  const data = await getOrders(filters);
  console.log("SESSION BHAI: ",session);
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Work Orders</h1>
        <Button asChild>
          <Link href="/orders/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Link>
        </Button>
      </div>

      <OrdersFilters />

      <OrdersTable orders={data.orders} userRole={session.user.role} />
      <div className="flex justify-end">
        <OrdersPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
}
