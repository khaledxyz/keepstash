import { timestamps, uuid } from "@infra/database/helpers";

import { user } from "@modules/auth/auth.schema";
import { bookmarkTag } from "@modules/bookmarks/schemas/bookmark-tag.schema";

import { relations } from "drizzle-orm";
import { index, pgTable, text } from "drizzle-orm/pg-core";

export const tag = pgTable(
  "tag",
  {
    ...uuid,
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => [index("tag_userId_idx").on(table.userId)]
);

export const tagRelations = relations(tag, ({ one, many }) => ({
  user: one(user, {
    fields: [tag.userId],
    references: [user.id],
  }),
  bookmarkTags: many(bookmarkTag),
}));
