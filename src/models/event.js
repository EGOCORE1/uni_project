import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.js';

export const events = sqliteTable('events', {
  eventId: integer('event_id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  lecturer_name: text('lecturer_name').notNull(),
  lecturer_title: text('lecturer_title'), 
  event_date: text('event_date').notNull(),
  event_time: text('event_time').notNull(),
  duration: text('duration').notNull(),
  max_capacity: integer('max_capacity').notNull(),
  session_axes: text('session_axes'), 
  organizerId: integer('organizer_id').references(() => users.userId),
});