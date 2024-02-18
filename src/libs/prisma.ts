/*import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export default function connectionWithPrisma() {
    if (!prisma) {
        prisma = new PrismaClient();
    }

    if (process.env.NODE_ENV !== "production") {
        return prisma;
    }

    return prisma;
}
*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;