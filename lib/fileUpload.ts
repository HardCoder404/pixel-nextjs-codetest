import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function saveUploadedFile(
  file: File
): Promise<{ url: string; name: string }> {
  // Validate file
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  // Create upload directory if it doesn't exist
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const extension = path.extname(file.name);
  const filename = `${timestamp}-${Math.random()
    .toString(36)
    .substring(2)}${extension}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  // Save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  return {
    url: `/uploads/${filename}`,
    name: filename,
  };
}

export async function deleteFile(filename: string): Promise<void> {
  if (!filename) return;

  const filepath = path.join(UPLOAD_DIR, filename);

  try {
    await unlink(filepath);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}
