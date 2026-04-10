import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './user.js';
import { events } from './event.js';

export const registrations = sqliteTable('registrations', {
  id: integer('registration_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  eventId: integer('event_id').references(() => events.id),
  status: text('status').default('pending'),
});