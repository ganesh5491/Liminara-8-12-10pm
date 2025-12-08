import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Support JSON storage mode for development
// If DATABASE_URL is not set or is SQLite in-memory, use JSON storage
const isJSONStorageMode =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL === "sqlite:///:memory:" ||
  process.env.DATABASE_URL.startsWith("sqlite://");

if (!isJSONStorageMode && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set for database mode. Or use 'sqlite:///:memory:' for JSON storage mode.",
  );
}

let pool: Pool | null = null;
let db: any = null;

if (!isJSONStorageMode && process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else if (isJSONStorageMode) {
  // Create a mock database object for JSON storage mode
  // This prevents errors when code tries to access db properties
  // Each method returns an object that supports further chaining

  const createChainable = (): any => {
    const chainable: any = {
      from: () => chainable,
      where: () => chainable,
      limit: () => Promise.resolve([]),
      orderBy: () => chainable,
      groupBy: () => chainable,
      leftJoin: () => chainable,
      rightJoin: () => chainable,
      innerJoin: () => chainable,
      select: () => chainable,
      execute: () => Promise.resolve([]),
      then: (resolve: any) => resolve([]),
    };
    // Make chainable thenable for await support
    chainable[Symbol.toStringTag] = 'Promise';
    return chainable;
  };

  db = {
    select: () => createChainable(),
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve([]),
        execute: () => Promise.resolve([]),
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([]),
          execute: () => Promise.resolve([]),
        }),
        returning: () => Promise.resolve([]),
        execute: () => Promise.resolve([]),
      }),
    }),
    delete: () => ({
      where: () => ({
        returning: () => Promise.resolve([]),
        execute: () => Promise.resolve([]),
      }),
    }),
  };
}

// Export null or mock for JSON storage mode
export { pool, db };
export const isJSONStorage = isJSONStorageMode;
