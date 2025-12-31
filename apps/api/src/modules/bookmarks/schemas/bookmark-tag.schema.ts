import { tag } from "@modules/tags/schemas/tag.schema";

import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  uuid as pgUuid,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

import { bookmark } from "./bookmark.schema";

export const bookmarkTag = pgTable(
  "bookmark_tag",
  {
    bookmarkId: pgUuid("bookmark_id")
      .notNull()
      .references(() => bookmark.id, { onDelete: "cascade" }),
    tagId: pgUuid("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.bookmarkId, table.tagId] }),
    index("bookmarkTag_bookmarkId_idx").on(table.bookmarkId),
    index("bookmarkTag_tagId_idx").on(table.tagId),
  ]
);

export const bookmarkTagRelations = relations(bookmarkTag, ({ one }) => ({
  bookmark: one(bookmark, {
    fields: [bookmarkTag.bookmarkId],
    references: [bookmark.id],
  }),
  tag: one(tag, {
    fields: [bookmarkTag.tagId],
    references: [tag.id],
  }),
}));
