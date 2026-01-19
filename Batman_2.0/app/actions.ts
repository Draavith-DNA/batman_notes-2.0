'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db"; 
import { notes, users, followers } from "@/db/schema"; 
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- 1. UPLOAD NOTE ACTION ---
export async function uploadNote(formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const subject = formData.get("subject") as string; 
  const branch = formData.get("branch") as string;
  const semester = formData.get("semester") as string;
  const type = formData.get("type") as string;

  try {
    await db.insert(notes).values({
      title, url, subject, branch, semester, type,
    });
    return { message: "success" };
  } catch (e) {
    console.error(e);
    return { message: "error" };
  }
}

// --- 2. ONBOARDING ACTION (Updates Clerk & Database) ---
export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { message: "No User Found" };

  // Extract all fields from the form
  const fullName = formData.get("fullName") as string;
  const usn = formData.get("usn") as string;
  const branch = formData.get("branch") as string;
  const semester = formData.get("semester") as string;
  const dob = formData.get("dob") as string;
  const bio = formData.get("bio") as string; // 🌟 New Bio Field

  try {
    // A. Update Clerk Metadata (For Profile display)
    const client = await clerkClient();
    const user = await client.users.getUser(userId); 
    const email = user.emailAddresses[0]?.emailAddress || "";

    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        usn, 
        branch, 
        semester, 
        dob, 
        bio, // 🌟 Save Bio to Clerk
        applicationName: fullName
      },
    });

    // B. Save to Database (For Network/Search)
    // Make sure you have added 'bio: text("bio")' to your users table in schema.ts
    await db.insert(users).values({
      id: userId,
      name: fullName,
      email: email,
      usn: usn,
      branch: branch,
      semester: semester,
      bio: bio, // 🌟 Save Bio to DB
    }).onConflictDoUpdate({
      target: users.id,
      set: { 
        name: fullName, 
        usn: usn, 
        branch: branch, 
        semester: semester,
        bio: bio // 🌟 Update bio if user already exists
      }
    });

    revalidatePath("/");
    revalidatePath("/profile");
    return { message: "success" };
  } catch (e) {
    console.error("Onboarding Error:", e);
    return { message: "error" };
  }
}

// --- 3. UPDATE BIO ACTION (For Profile "Edit Bio" button) ---
export async function updateBio(newBio: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Not logged in" };

  try {
    const client = await clerkClient();
    
    // 1. Update Clerk Metadata
    await client.users.updateUser(userId, {
      publicMetadata: {
        bio: newBio,
      },
    });

    // 2. Update Database
    await db.update(users)
      .set({ bio: newBio })
      .where(eq(users.id, userId));
    
    revalidatePath("/profile"); 
    return { success: true };
  } catch (e) {
    console.error("Bio Update Error:", e);
    return { success: false, message: "Failed to update bio" };
  }
}

// --- 4. TOGGLE FOLLOW ACTION ---
export async function toggleFollow(targetUserId: string) {
  const { userId: myId } = await auth();
  if (!myId) return { success: false };

  try {
    const existing = await db.select().from(followers).where(
      and(
        eq(followers.followerId, myId),
        eq(followers.followingId, targetUserId)
      )
    );

    if (existing.length > 0) {
      // UNFOLLOW
      await db.delete(followers).where(
        and(
          eq(followers.followerId, myId),
          eq(followers.followingId, targetUserId)
        )
      );
    } else {
      // FOLLOW
      await db.insert(followers).values({
        followerId: myId,
        followingId: targetUserId
      });
    }

    revalidatePath("/network"); 
    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

// --- 5. SYNC USER ACTION (Helper to keep DB in check) ---
export async function syncUserToNetwork() {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Not logged in" };

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata;

    if (metadata.onboardingComplete) {
       await db.insert(users).values({
          id: userId,
          name: user.fullName || "Student",
          email: user.emailAddresses[0]?.emailAddress || "",
          usn: metadata.usn as string,
          branch: metadata.branch as string,
          semester: metadata.semester as string,
          bio: metadata.bio as string, // 🌟 Include Bio in sync
       }).onConflictDoUpdate({
          target: users.id,
          set: { 
            name: user.fullName || "Student",
            usn: metadata.usn as string,
            branch: metadata.branch as string,
            semester: metadata.semester as string,
            bio: metadata.bio as string
          } 
       });
       return { success: true };
    }
    return { success: false, message: "Profile incomplete" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Sync failed" };
  }
}