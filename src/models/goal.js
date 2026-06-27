import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm'; 
export const goals = sqliteTable("goals", {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
});