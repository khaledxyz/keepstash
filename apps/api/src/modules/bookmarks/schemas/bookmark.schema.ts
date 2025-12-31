import { timestamps, uuid } from "@infra/database/helpers";

import { user } from "@modules/auth/auth.schema";

import { relations, sql } from "drizzle-orm";
import { index, pgTable, uuid as pgUuid, text } from "drizzle-orm/pg-core";
import { folder } from "@/modules/folders/schemas/folder.schema";

import { bookmarkTag } from "./bookmark-tag.schema";

export const bookmark = pgTable(
  "bookmark",
  {
    ...uuid,
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    folderId: pgUuid("folder_id").references(() => folder.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    url: text("url").notNull(),
    ...timestamps,
  },
  (table) => [
    index("bookmark_userId_idx").on(table.userId),
    index("bookmark_folderId_idx").on(table.folderId),
    index("bookmark_title_gin_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.title})`
    ),
    index("bookmark_description_gin_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.description})`
    ),
  ]
);

export const bookmarkRelations = relations(bookmark, ({ one, many }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
  folder: one(folder, {
    fields: [bookmark.folderId],
    references: [folder.id],
  }),
  bookmarkTags: many(bookmarkTag),
}));
