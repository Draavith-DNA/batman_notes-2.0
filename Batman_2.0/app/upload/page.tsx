'use client'

import { uploadNote } from "../actions"; 
import { useState } from "react";

export default function UploadPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("Uploading...");
    const result = await uploadNote(formData);
    if (result.message === "success") {
      setStatus("✅ Saved successfully!");
    } else {
      setStatus("❌ Error saving note");
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Material</h1>
        
        <form action={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              name="title" 
              required 
              placeholder="e.g. Module 1 Notes" 
              className="w-full p-2 border rounded mt-1 text-black" 
            />
          </div>

          {/* Google Drive Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Drive Link (URL)</label>
            <input 
              name="url" 
              required 
              type="url" 
              placeholder="https://drive.google.com..." 
              className="w-full p-2 border rounded mt-1 text-black" 
            />
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input 
              name="subject" 
              required 
              placeholder="e.g. Mathematics III" 
              className="w-full p-2 border rounded mt-1 text-black" 
            />
          </div>

          {/* Selectors Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select name="branch" className="w-full p-2 border rounded mt-1 text-black">
                <option value="CSE">CSE</option>
                <option value="ISE">ISE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select name="semester" className="w-full p-2 border rounded mt-1 text-black">
                <option value="p-cycle">P-Cycle (Physics)</option>
                <option value="c-cycle">C-Cycle (Chemistry)</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select name="type" className="w-full p-2 border rounded mt-1 text-black">
              <option value="notes">Notes</option>
              <option value="textbook">Textbook</option>
              <option value="qp">Question Paper</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            Upload to Database
          </button>

          {status && <p className="text-center mt-4 font-medium">{status}</p>}
        </form>
      </div>
    </div>
  );
}