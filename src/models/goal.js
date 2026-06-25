import { mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const goals = mysqlTable("goals", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
});