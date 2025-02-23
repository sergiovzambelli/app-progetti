"use client";

import { useState, useEffect, useRef } from "react";
import Bubble from "../components/Bubble";

interface Element {
  id: number;
  name: string;
}

interface Position {
  x: number;
  y: number;
}

const elements: Element[] = [
  { id: 1, name: "Applicazione Per Idee" },
  { id: 2, name: "Applicazione Per Progetti" },
  { id: 3, name: "App Mano Paolo" },
  { id: 4, name: "Sito Sergio Fotografia" },
  { id: 5, name: "GGG" },
  { id: 6, name: "Pythagorean" },
  { id: 7, name: "Game Theory Course" },
  { id: 8, name: "Agent On Hugging Face" },
];

// Define a color palette
const colors = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#FF9F1C", 
  "#6B5B95", "#88D8B0", "#FFCCCC", "#AAD8B0", 
  "#B19CD9", "#FFD700",
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
                  x: Math.random() * (offsetWidth - 50),
                  y: Math.random() * (offsetHeight - 50),
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
  }, []);

  const handlePositionUpdate = (id: number, newPosition: Position) => {
    setPositions((prev) => ({
      ...prev,
      [id]: newPosition,
    }));
  };

  return (
    <div ref={containerRef} className="w-screen h-screen bg-dark-blue overflow-hidden relative">
      {elements.map((element) => (
        <Bubble
          key={element.id}
          element={element}
          position={positions[element.id] || { x: 100, y: 100 }} // Fallback position
          onPositionUpdate={handlePositionUpdate}
          color={colors[element.id % colors.length]}
          constraints={constraints}
        />
      ))}
    </div>
  );
}
