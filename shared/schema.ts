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

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
