import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

// 1. NOTES TABLE (Existing)
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  subject: text("subject").notNull(),
  branch: text("branch").notNull(),
  semester: text("semester").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. USERS TABLE (New - Stores student info locally)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // This will match the Clerk User ID (e.g., user_2p...)
  name: text("name").notNull(),
  email: text("email").notNull(),
  usn: text("usn"),
  branch: text("branch"),
  semester: text("semester"),
  createdAt: timestamp("created_at").defaultNow(),
  bio: text("bio"),
});

// 3. FOLLOWERS TABLE (New - Who follows whom)
export const followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  followerId: text("follower_id").notNull(), // The person doing the following
  followingId: text("following_id").notNull(), // The person being followed
  createdAt: timestamp("created_at").defaultNow(),
});