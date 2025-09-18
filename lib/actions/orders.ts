"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import {
  createWorkOrderSchema,
  updateWorkOrderSchema,
  searchFiltersSchema,
} from "@/lib/validations";
import type { PaginatedOrders, OrderFilters } from "@/types";
import { saveUploadedFile, deleteFile } from "@/lib/fileUpload";

const ITEMS_PER_PAGE = 10;

export async function getOrders(
  filters: OrderFilters
): Promise<PaginatedOrders> {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedFilters = searchFiltersSchema.parse(filters);
  const { search, status, priority, page } = validatedFilters;

  // DEBUG LOGS - Ye terminal mein dikhenge
  console.log("=== getOrders Debug ===");
  console.log("Raw filters received:", filters);
  console.log("Validated filters:", validatedFilters);
  console.log("Status filter:", status);
  console.log("Priority filter:", priority);
  console.log("Search filter:", search);
  console.log("Page:", page);
  console.log("User role:", session.user.role);

  const where: any = {
    ...(session.user.role === "USER" && { createdById: session.user.id }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(status && { status }),
    ...(priority && { priority }),
  };

  console.log("Final where clause:", JSON.stringify(where, null, 2));

  const [orders, totalCount] = await Promise.all([
    prisma.workOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.workOrder.count({ where }),
  ]);

  console.log("Orders found:", orders.length);
  console.log(
    "Order statuses:",
    orders.map((o) => `${o.title}: ${o.status}`)
  );
  console.log("Total count:", totalCount);

  return {
    orders: orders as any[],
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export async function createWorkOrder(data: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedData = createWorkOrderSchema.parse({
    title: data.get("title"),
    description: data.get("description"),
    priority: data.get("priority"),
  });

  // Handle image upload
  let imageUrl: string | null = null;
  let imageName: string | null = null;

  const imageFile = data.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    try {
      const uploadResult = await saveUploadedFile(imageFile);
      imageUrl = uploadResult.url;
      imageName = uploadResult.name;
    } catch (error: any) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Handle assignment for managers
  let assignedToId: string | null = null;
  if (session.user.role === "MANAGER") {
    const assignedTo = data.get("assignedToId") as string;
    if (assignedTo && assignedTo !== "unassigned") {
      assignedToId = assignedTo;
    }
  }

  // CREATE THE WORK ORDER IN DATABASE - This was missing!
  await prisma.workOrder.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      priority: validatedData.priority,
      status: "OPEN", // Default status
      createdById: session.user.id,
      assignedToId,
      imageUrl,
      imageName,
    },
  });

  revalidatePath("/orders");
  redirect("/orders");
}

export async function updateWorkOrder(orderId: string, data: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  // Check if user has access to this order
  const existingOrder = await prisma.workOrder.findUnique({
    where: { id: orderId },
  });

  if (!existingOrder) throw new Error("Order not found");

  if (
    session.user.role === "USER" &&
    existingOrder.createdById !== session.user.id
  ) {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};

  if (data.get("title")) updateData.title = data.get("title");
  if (data.get("description")) updateData.description = data.get("description");
  if (data.get("priority")) updateData.priority = data.get("priority");

  // Handle image upload
  const imageFile = data.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    try {
      // Delete old image if exists
      if (existingOrder.imageName) {
        await deleteFile(existingOrder.imageName);
      }

      // Upload new image
      const uploadResult = await saveUploadedFile(imageFile);
      updateData.imageUrl = uploadResult.url;
      updateData.imageName = uploadResult.name;
    } catch (error: any) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Only managers can update status and assignedTo
  if (session.user.role === "MANAGER") {
    if (data.get("status")) updateData.status = data.get("status");
    if (data.has("assignedToId")) {
      const assignedToId = data.get("assignedToId") as string;
      updateData.assignedToId =
        assignedToId === "unassigned" ? null : assignedToId;
    }
  }

  const validatedData = updateWorkOrderSchema.parse(updateData);

  await prisma.workOrder.update({
    where: { id: orderId },
    data: validatedData,
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function getWorkOrder(orderId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  const order = await prisma.workOrder.findUnique({
    where: { id: orderId },
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      assignedTo: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  if (!order) throw new Error("Order not found");

  // Check access control
  if (session.user.role === "USER" && order.createdById !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return order;
}

export async function getUsers() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "MANAGER") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
}
