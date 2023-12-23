import { boolean, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('same', {length: 255}).notNull(), 
  surname: varchar('surname', {length: 255}).notNull(),
  email: varchar('email', {length: 255}).notNull(),
  password: varchar('password', {length: 255}).notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
})