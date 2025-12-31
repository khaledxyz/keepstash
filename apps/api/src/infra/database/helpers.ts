import { uuid as pgUuid, serial, timestamp } from "drizzle-orm/pg-core";

export const id = {
  id: serial("id").primaryKey(),
};

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

export const uuid = {
  id: pgUuid("id").primaryKey().notNull().defaultRandom(),
};
