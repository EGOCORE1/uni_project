import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { events } from './event.js'; // يفضل الاستيراد هنا إذا لم يكن هناك تداخل

export const eventMedia = sqliteTable('event_media', {
    id: integer('media_id').primaryKey({ autoIncrement: true }),
    event_id: integer('event_id').references(() => events.id), // تأكدي من تسميته هنا event_id
    mediaUrl: text('media_url').notNull(),
    mediaType: text('media_type').default('image'),
});