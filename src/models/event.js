import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm'; 
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  featured : integer('featured').default(0),
  agenda : text('agenda'),
  speaker: text('speaker'), 
  speakerTitle: text('speakerTitle'), 
  location: text('location'),
  description: text('description'),
  date: text('date'), 
  time: text('time'), 
  duration: text('duration'),
  attendees: integer('attendees'),          
  current_attendees: integer('current_attendees').default(0), 
  status: text('status').default('upcoming'),
 organizerId: integer('organizer_id')
});
