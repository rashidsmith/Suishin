import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Legacy support for old storage interface
export const legacyInsertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LegacyInsertUser = z.infer<typeof legacyInsertUserSchema>;

// Cards table
export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  ibo_id: text("ibo_id").notNull(),
  learning_objective_id: text("learning_objective_id").notNull(),
  target_duration: integer("target_duration").notNull(), // in minutes
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Activities table
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  card_id: uuid("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // C1, C2, C3, C4
  duration: integer("duration").notNull(), // in minutes
  order_index: integer("order_index").notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCardSchema = createInsertSchema(cards).pick({
  title: true,
  description: true,
  ibo_id: true,
  learning_objective_id: true,
  target_duration: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  card_id: true,
  title: true,
  description: true,
  type: true,
  duration: true,
  order_index: true,
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  learning_objective_id: text("learning_objective_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("not_started"), // 'not_started' | 'in_progress' | 'completed' | 'paused'
  persona_id: uuid("persona_id").notNull(),
  topic: text("topic").notNull(),
  modality: text("modality").notNull(), // 'onsite' | 'virtual' | 'hybrid'
  business_goals: text("business_goals").notNull(),
  started_at: timestamp("started_at"),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  user_id: true,
  learning_objective_id: true,
  title: true,
  status: true,
  persona_id: true,
  topic: true,
  modality: true,
  business_goals: true,
  started_at: true,
  completed_at: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
