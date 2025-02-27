"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient"; // Import Supabase client

interface PanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onElementCreated: () => void; // Callback to refresh the list of elements
}

export default function Panel({ isOpen, onToggle, onElementCreated }: PanelProps) {
  const [name, setName] = useState(""); // State for the input field

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name cannot be empty!"); // Basic validation
      return;
    }

    try {
      // Insert new element into Supabase
      const { data, error } = await supabase
        .from("projects") // Replace with your table name
        .insert([{ name: name.trim() }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        console.log("New element created:", data);
        setName(""); // Clear the input field
        onElementCreated(); // Refresh the list of elements
      }
    } catch (error) {
      console.error("Error creating new element:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "300px" }}
    >
      <button
        onClick={onToggle}
        className="absolute top-4 -left-12 bg-violet-500 text-white p-2 rounded-l-lg"
      >
        {isOpen ? "◄" : "►"}
      </button>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              placeholder="Enter project name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}