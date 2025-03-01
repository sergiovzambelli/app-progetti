"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Bubble from "../components/Bubble";
import Panel from "@/components/Panel";
import { supabase } from "@/utils/supabaseClient"; // Import the Supabase client
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Element {
  id: number;
  name: string;
}

interface Position {
  x: number;
  y: number;
}

// Define a color palette
const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#FF9F1C",
  "#6B5B95",
  "#88D8B0",
  "#FFCCCC",
  "#AAD8B0",
  "#B19CD9",
  "#FFD700",
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const [positions, setPositions] = useState<{ [key: number]: Position }>({});
  const [isPanelOpen, setIsPanelOpen] = useState(false); // State for panel visibility
  const [elements, setElements] = useState<Element[]>([]); // State for fetched elements
  const [loading, setLoading] = useState(true); // State for loading indicator

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/signin'); // Redirect to sign-in page if the user is null
    }
  }, [user, router]);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("projects") // Replace with your table name
        .select("*");

      if (error) {
        throw error;
      }

      if (data) {
        setElements(data); // Update the elements state with fetched data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [fetchData]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's running on client

    const updateConstraints = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setConstraints({
          left: 0,
          right: offsetWidth - 50, // Adjusted for bubble size
          top: 0,
          bottom: offsetHeight - 50,
        });

        // Set initial positions if not already set
        setPositions((prevPositions) =>
          Object.keys(prevPositions).length === 0
            ? elements.reduce((acc, element) => {
                acc[element.id] = {
                  x: offsetWidth / 2, // Center X
                  y: offsetHeight / 2, // Center Y
                };
                return acc;
              }, {} as { [key: number]: Position })
            : prevPositions
        );
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [elements]); // Re-run when elements change

  const handlePositionUpdate = (id: number, newPosition: Position) => {
    setPositions((prev) => ({
      ...prev,
      [id]: newPosition,
    }));
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-dark-blue flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-dark-blue overflow-hidden relative"
    >
      {elements.map((element) => (
        <Bubble
          key={element.id}
          element={element}
          position={positions[element.id] || { x: 200, y: 300 }} // Fallback position
          onPositionUpdate={handlePositionUpdate}
          color={colors[element.id % colors.length]}
          constraints={constraints}
        />
      ))}
      <Panel
        isOpen={isPanelOpen}
        onToggle={togglePanel}
        onElementCreated={fetchData} // Pass fetchData to refresh the list
      />
    </div>
  );
}