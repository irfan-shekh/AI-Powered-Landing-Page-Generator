import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString })) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedProxyHeaders: true,
    trustedOrigins: [
        process.env.BETTER_AUTH_URL?.replace(/\/$/, "") as string,
    ].filter(Boolean),
    baseURL: process.env.BETTER_AUTH_URL?.replace(/\/$/, ""),
});
