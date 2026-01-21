'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db"; 
import { notes, users, followers, userBadges } from "@/db/schema"; 
import { eq, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * SECTION 1: USER ONBOARDING & PROFILE
 */

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "No User Found" };

  const fullName = formData.get("fullName") as string;
  const rawUsn = formData.get("usn") as string;
  const usn = rawUsn ? rawUsn.toUpperCase().trim() : "UNKNOWN"; 
  const branch = formData.get("branch") as string;
  const semester = formData.get("semester") as string;
  const bio = formData.get("bio") as string;
  
  const rawCycle = formData.get("cycle") as string; 
  const cycle = semester === "1" ? (rawCycle || "none") : "none";

  try {
    const existingUser = await db.select().from(users).where(eq(users.usn, usn));
    if (existingUser.length > 0 && existingUser[0].id !== userId) {
      return { success: false, message: "USN already registered." };
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId); 
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        usn, branch, cycle, semester, bio
      },
    });

    await db.insert(users).values({
      id: userId, name: fullName, email, usn, branch, semester, cycle, bio,
    }).onConflictDoUpdate({
      target: users.id,
      set: { name: fullName, usn, branch, semester, cycle, bio }
    });

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true, message: "success" };
  } catch (e) {
    return { success: false, message: "Error during onboarding." };
  }
}

export async function updateBio(newBio: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };
  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, { publicMetadata: { bio: newBio } });
    await db.update(users).set({ bio: newBio }).where(eq(users.id, userId));
    revalidatePath("/profile");
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function syncUserToNetwork() {
  const { userId } = await auth();
  if (!userId) return { success: false };
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const metadata = clerkUser.publicMetadata;
    
    if (metadata.onboardingComplete) {
       await db.insert(users).values({
          id: userId, 
          name: clerkUser.fullName || "Student", 
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          usn: (metadata.usn as string), 
          branch: (metadata.branch as string), 
          semester: (metadata.semester as string),
          cycle: (metadata.cycle as string), 
          bio: (metadata.bio as string),
       }).onConflictDoUpdate({
          target: users.id,
          set: { 
            name: clerkUser.fullName || "Student", 
            usn: (metadata.usn as string), 
            branch: (metadata.branch as string), 
            semester: (metadata.semester as string), 
            cycle: (metadata.cycle as string), 
            bio: (metadata.bio as string) 
          } 
       });
       revalidatePath("/profile");
       return { success: true };
    }
    return { success: false };
  } catch (e) { return { success: false }; }
}

/**
 * SECTION 2: INTELLIGENCE (NOTES) MANAGEMENT
 */

export async function uploadNote(formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const subject = formData.get("subject") as string; 
  const branch = formData.get("branch") as string;
  const semester = formData.get("semester") as string;
  const type = formData.get("type") as string;
  const cycle = formData.get("cycle") as string || "none"; 

  try {
    await db.insert(notes).values({
      title, url, subject, branch, semester, type, cycle
    });
    revalidatePath("/dashboard");
    return { success: true, message: "success" };
  } catch (e) {
    return { success: false, message: "error" };
  }
}

/**
 * SECTION 3: NETWORK & SOCIAL LOGIC
 */

export async function toggleFollow(targetUserId: string) {
  const { userId: myId } = await auth();
  if (!myId) return { success: false };
  try {
    const existing = await db.select().from(followers).where(
      and(eq(followers.followerId, myId), eq(followers.followingId, targetUserId))
    );

    if (existing.length > 0) {
      await db.delete(followers).where(and(eq(followers.followerId, myId), eq(followers.followingId, targetUserId)));
    } else {
      await db.insert(followers).values({ followerId: myId, followingId: targetUserId });
    }
    revalidatePath("/profile");
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function getFollowStats(userId: string) {
  try {
    const followersRes = await db.select({ value: count() }).from(followers).where(eq(followers.followingId, userId));
    const followingRes = await db.select({ value: count() }).from(followers).where(eq(followers.followerId, userId));
    return { followerCount: followersRes[0]?.value || 0, followingCount: followingRes[0]?.value || 0 };
  } catch (e) { return { followerCount: 0, followingCount: 0 }; }
}

/**
 * SECTION 4: ADMINISTRATIVE OPERATIONS (BADGES & BULK)
 */

export async function grantBadge(formData: FormData) {
  const usn = (formData.get("usn") as string).toUpperCase();
  const badgeType = formData.get("badgeType") as string;

  let badgeImage = "/badges/default.png"; 
  if (badgeType === "contributor") badgeImage = "/badges/contributor.png";
  if (badgeType === "moderator") badgeImage = "/badges/moderator.png";
  if (badgeType === "elite") badgeImage = "/badges/elite.png";

  try {
    await db.insert(userBadges).values({
      userUsn: usn,
      badgeType: badgeType.toUpperCase(),
      badgeImage: badgeImage, 
    });
    revalidatePath("/profile");
    return { success: true, message: `ASSET ${badgeType} DEPLOYED TO ${usn}` };
  } catch (e) {
    return { success: false, message: "DATABASE ENCRYPTION ERROR" };
  }
}

export async function bulkPromoteSemester(currentSem: string, nextSem: string) {
  const { userId: adminId } = await auth();
  if (!adminId) return { success: false };

  try {
    const targetUsers = await db.select().from(users).where(eq(users.semester, currentSem));
    const client = await clerkClient();

    for (const user of targetUsers) {
      await client.users.updateUser(user.id, {
        publicMetadata: { semester: nextSem }
      });
    }

    await db.update(users).set({ semester: nextSem }).where(eq(users.semester, currentSem));

    revalidatePath("/admin");
    return { success: true, count: targetUsers.length };
  } catch (e) { return { success: false }; }
}

export async function bulkSwitchCycle(fromCycle: string, toCycle: string) {
  const { userId: adminId } = await auth();
  if (!adminId) return { success: false };

  try {
    const targetUsers = await db.select().from(users).where(
      and(eq(users.semester, "1"), eq(users.cycle, fromCycle))
    );
    const client = await clerkClient();

    for (const user of targetUsers) {
      await client.users.updateUser(user.id, {
        publicMetadata: { cycle: toCycle }
      });
    }

    await db.update(users).set({ cycle: toCycle }).where(and(eq(users.semester, "1"), eq(users.cycle, fromCycle)));

    revalidatePath("/admin");
    return { success: true, count: targetUsers.length };
  } catch (e) { return { success: false }; }
}