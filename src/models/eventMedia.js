import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { events } from './event.js';

export const eventMedia = sqliteTable('event_media', {
  id: integer('media_id').primaryKey({ autoIncrement: true }),
  event_Id: integer('event_id').references(() => events.id),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type').default('image'),
});

export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
  event: one(events, {
    fields: [eventMedia.event_Id],
    references: [events.id],
  }),
}));