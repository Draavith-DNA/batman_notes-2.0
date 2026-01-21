import { pgTable, serial,integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

// 1. NOTES TABLE
// Stores all uploaded intelligence (PDFs, Videos, etc.)
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  subject: text("subject").notNull(),
  branch: text("branch").notNull(),
  semester: text("semester").notNull(),
  // 🌟 Added Cycle to separate P-Cycle and C-Cycle intelligence
  cycle: text("cycle").default("none"), 
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. USERS TABLE
// Stores student profiles synced from Clerk
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Matches Clerk User ID
  name: text("name").notNull(),
  email: text("email").notNull(),
  usn: text("usn"),
  branch: text("branch"),
  semester: text("semester"),
  // 🌟 Added Cycle to store user's academic track
  cycle: text("cycle").default("none"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. FOLLOWERS TABLE
// Manages the social graph (Nexus)
export const followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  followerId: text("follower_id").notNull(),
  followingId: text("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. USER BADGES TABLE
// For rewarding contributors and legends

export const userBadges = pgTable("user_badges", {
  // Use integer + identity for auto-incrementing IDs in Postgres
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userUsn: text("user_usn").notNull(), 
  badgeType: text("badge_type").notNull(),
  badgeImage: text("badge_image").notNull(), 
});