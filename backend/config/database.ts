import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (e: unknown) {
    console.error("Error disconnecting Prisma", e);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (e: unknown) {
    console.error("Error disconnecting Prisma", e);
    process.exit(1);
  }
});
