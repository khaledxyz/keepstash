import { sql } from "drizzle-orm";
import { uuid as baseUUID } from "drizzle-orm/pg-core";

export const uuid = {
  id: baseUUID().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
};
