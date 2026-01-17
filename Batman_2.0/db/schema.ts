import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),     // e.g., "Module 1 - Introduction"
  url: text("url").notNull(),         // e.g., Drive Link
  
  // --- The New Column ---
  subject: text("subject").notNull(), // e.g., "Mathematics III"
  
  branch: text("branch").notNull(),   // e.g., "CSE"
  semester: text("semester").notNull(), // e.g., "3"
  type: text("type").notNull(),       // e.g., "notes"
  createdAt: timestamp("created_at").defaultNow(),
});