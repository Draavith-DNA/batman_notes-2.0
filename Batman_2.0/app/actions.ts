'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "../db"; 
import { notes } from "../db/schema";


// ... imports stay the same ...

export async function uploadNote(formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  // Get the Subject from the form
  const subject = formData.get("subject") as string; 
  const branch = formData.get("branch") as string;
  const semester = formData.get("semester") as string;
  const type = formData.get("type") as string;

  try {
    await db.insert(notes).values({
      title: title,
      url: url,
      subject: subject, // Save it to DB
      branch: branch,
      semester: semester,
      type: type,
    });

    return { message: "success" };
  } catch (e) {
    console.error(e);
    return { message: "error" };
  }
}
export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No User Found" };
  }

  // 1. Get data from the form
  // We use .get() to pull the values from the input fields
  const fullName = formData.get("fullName") as string;
  const usn = formData.get("usn") as string;
  const branch = formData.get("branch") as string;
  const semester = formData.get("semester") as string;
  const dob = formData.get("dob") as string;

  try {
    // 2. Connect to Clerk
    const client = await clerkClient();

    // 3. Update the user's metadata (The "Extra Storage")
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true, // The "Badge"
        usn: usn,
        branch: branch,
        semester: semester,
        dob: dob,
        applicationName: fullName
      },
    });

    return { message: "success" };
    
  } catch (e) {
    console.error("error", e);
    return { message: "error" };
  }
}