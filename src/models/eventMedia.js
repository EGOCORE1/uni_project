import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const eventMedia = sqliteTable('event_media', {
    id: integer('media_id').primaryKey({ autoIncrement: true }),
    event_id: integer('event_id'), 
    mediaUrl: text('media_url').notNull(),
    mediaType: text('media_type').default('image'),
});