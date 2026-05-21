import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: process.env.DATABASE_POOL_LIMIT ? parseInt(process.env.DATABASE_POOL_LIMIT, 10) : 10,
  idleTimeoutMillis: 30000
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;

/**
 * WHY THIS FILE EXISTS
Without this:
we’d repeat Prisma initialization everywhere
This creates:
→ centralized database client
Professional practice.
 */