import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { customAlphabet, nanoid } from 'nanoid';
import { users } from '.';

export const projects = pgTable('project', {
  id: text('id').notNull().primaryKey().$defaultFn(nanoid),
  token: text('token').notNull().$defaultFn(customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 32)),
  name: text('name').notNull(),
  platform: text('platform').notNull(),
  userId: text('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  integrationId: text('integration_id')
    .references(() => integrations.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const integrations = pgTable('integration', {
  id: text('id').notNull().primaryKey().$defaultFn(nanoid),
  slackUrl: text('slack_url'),
  discordUrl: text('discord_url'),
  webhookUrl: text('webhook_url'),
});

export const projectRelations = relations(projects, ({ one }) => {
  return {
    user: one(users, { fields: [projects.userId], references: [users.id] }),
    integration: one(integrations, { fields: [projects.userId], references: [integrations.id] }),
  };
});
