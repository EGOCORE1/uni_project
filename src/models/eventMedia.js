import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { events } from './event.js';
export const eventMedia = sqliteTable('event_media', {
  id: integer('media_id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type'),
});