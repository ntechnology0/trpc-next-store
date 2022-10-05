import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  prisma = prisma;
}

export default prisma;
