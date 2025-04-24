import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  karma: integer("karma").notNull().default(0),
  textAvatar: text("text_avatar").notNull().default("(⌐□_□)"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Character schema
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // HERO, VILLAIN, DETECTIVE, etc.
  description: text("description").notNull(),
  textAvatar: text("text_avatar").notNull(),
  userId: integer("user_id").references(() => users.id), // NULL for system characters
  karma: integer("karma").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Accusation schema
export const accusations = pgTable("accusations", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isCustom: boolean("is_custom").notNull().default(false),
  createdBy: integer("created_by").references(() => users.id), // NULL for system accusations
  createdAt: timestamp("created_at").defaultNow(),
});

// Trial schema
export const trials = pgTable("trials", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id),
  accusationId: integer("accusation_id").notNull().references(() => accusations.id),
  defenseTitle: text("defense_title").notNull(),
  defenseContent: text("defense_content").notNull(),
  userId: integer("user_id").references(() => users.id),
  karmaInnocent: integer("karma_innocent").notNull().default(0),
  karmaGuilty: integer("karma_guilty").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  endTime: timestamp("end_time"), // When the trial ends
  createdAt: timestamp("created_at").defaultNow(),
});

// Vote schema
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  trialId: integer("trial_id").notNull().references(() => trials.id),
  userId: integer("user_id").notNull().references(() => users.id),
  isInnocent: boolean("is_innocent").notNull(), // true for innocent, false for guilty
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  karma: true,
  createdAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  karma: true,
  createdAt: true,
});

export const insertAccusationSchema = createInsertSchema(accusations).omit({
  id: true,
  createdAt: true,
});

export const insertTrialSchema = createInsertSchema(trials).omit({
  id: true,
  karmaInnocent: true,
  karmaGuilty: true,
  isActive: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Accusation = typeof accusations.$inferSelect;
export type Trial = typeof trials.$inferSelect;
export type Vote = typeof votes.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertAccusation = z.infer<typeof insertAccusationSchema>;
export type InsertTrial = z.infer<typeof insertTrialSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
