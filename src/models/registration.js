import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.js';
import { events } from './event.js';

export const registrations = sqliteTable('registrations', {
  registrationId: integer('registration_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.userId),
  eventId: integer('event_id').references(() => events.eventId),
  full_name: text('full_name').notNull(),
  email: text('email').notNull(),
  phone_number: text('phone_number').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).default(new Date()),
});