import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const AboutUs = sqliteTable('AboutUs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('fullName').notNull(),
    position : text('position').notNull(),
    description: text('description').notNull(),
    createdAt : text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt : text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});