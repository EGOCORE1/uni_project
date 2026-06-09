import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm'; 
import { events } from './event.js';
import { users } from './user.js';

export const registrations = sqliteTable('registrations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    eventId: integer('event_id')
        .notNull()
        .references(() => events.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    full_name: text('full_name').notNull(),
    email: text('email').notNull(),
    phone_number: text('phone_number').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`) 
});

export const registrationsRelations = relations(registrations, ({ one }) => ({
    event: one(events, {
        fields: [registrations.eventId],
        references: [events.id],
    }),
    user: one(users, {
        fields: [registrations.userId],
        references: [users.id],
    }),
}));