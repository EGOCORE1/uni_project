import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './user.js';
export const notifications = sqliteTable('notifications', {
  id: integer('notification_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  message: text('message_text').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
});