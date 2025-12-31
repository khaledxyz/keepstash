import { timestamps, uuid } from "@infra/database/helpers";

import { user } from "@modules/auth/auth.schema";
import { bookmark } from "@modules/bookmarks/schemas/bookmark.schema";

import { relations } from "drizzle-orm";
import { index, pgTable, text } from "drizzle-orm/pg-core";

export const folder = pgTable(
  "folder",
  {
    ...uuid,
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    ...timestamps,
  },
  (table) => [index("folder_userId_idx").on(table.userId)]
);

export const folderRelations = relations(folder, ({ one, many }) => ({
  user: one(user, {
    fields: [folder.userId],
    references: [user.id],
  }),
  bookmarks: many(bookmark),
}));
