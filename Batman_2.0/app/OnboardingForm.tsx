'use client'

import { useState } from "react";
import { completeOnboarding } from "./actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Get the current user to pre-fill name if needed

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Stop page from refreshing
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await completeOnboarding(formData);

    if (result.message === "success") {
      // Reload the page so the dashboard appears
      router.refresh();
      // Optional: Force a hard reload to ensure data updates
      window.location.reload(); 
    } else {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome to College Portal</h2>
      <p className="mb-6 text-gray-600 text-center text-sm">Please finish your profile to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            name="fullName" 
            required 
            defaultValue={user?.fullName || ""}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black" 
            placeholder="Enter your full name"
          />
        </div>

        {/* USN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">USN (University Seat No)</label>
          <input 
            name="usn" 
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black" 
            placeholder="4VP..."
          />
        </div>

        {/* Branch & Semester Row */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <select name="branch" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black">
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <select name="semester" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black">
              <option value="1">1st</option>
              <option value="3">3rd</option>
              <option value="5">5th</option>
              <option value="7">7th</option>
            </select>
          </div>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input 
            type="date" 
            name="dob" 
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition mt-4"
        >
          {loading ? "Saving Profile..." : "Complete Onboarding"}
        </button>
      </form>
    </div>
  );
}