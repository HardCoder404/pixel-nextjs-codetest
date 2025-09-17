import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold">Not signed in</h1>
        <p className="mt-2">Please <Link className="underline" href="/login">sign in</Link>.</p>
      </div>
    );
  }

  const where: any = session.user.role === "USER" ? { createdById: session.user.id } : {};
  const orders = await prisma.workOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { createdBy: true, assignedTo: true }
  });

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-3">Orders</h1>
      {orders.length === 0 && <p className="text-sm text-zinc-500">No orders yet.</p>}
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {orders.map(o => (
          <div key={o.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{o.title}</div>
              <div className="text-xs text-zinc-500">Created by {o.createdBy?.email} · Assigned to {o.assignedTo?.email ?? "—"}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge">{o.status.toLowerCase()}</span>
              <span className="badge">{o.priority.toLowerCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
