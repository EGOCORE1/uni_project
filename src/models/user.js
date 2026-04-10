import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('user_id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password_hash').notNull(),
  role: text('role').default('student'),
});