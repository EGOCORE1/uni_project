import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './user.js'; 
import { eventMedia } from './eventMedia.js';

export const events = sqliteTable('events', {
  id: integer('event_id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  event_date: text('event_date').notNull(),
  event_time: text('event_time'),
  lecturer_name: text('lecturer_name'),
  lecturer_title: text('lecturer_title'),
  session_axes: text('session_axes'),
  
  maxCapacity: integer('max_capacity').notNull(),
  organizerId: integer('organizer_id').references(() => users.id),
});

export const eventsRelations = relations(events, ({ many }) => ({
  media: many(eventMedia),
}));