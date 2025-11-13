import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Leaderboard entries
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  teamId: text("team_id").notNull(),
  timeTaken: integer("time_taken").notNull(), // in seconds
  moves: integer("moves").notNull(),
  score: real("score").notNull(), // time / moves
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  teamId: true,
  timeTaken: true,
  moves: true,
  score: true,
});

export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
