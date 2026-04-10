import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './user.js'; 

export const events = sqliteTable('events', {
  id: integer('event_id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  date: text('event_date').notNull(),
  maxCapacity: integer('max_capacity').notNull(),
  organizerId: integer('organizer_id').references(() => users.id),
});