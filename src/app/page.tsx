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

// Sample data for the bubbles
const elements: Element[] = [
  { id: 1, name: "Progetto bello" },
  { id: 2, name: "Sposarsi" },
  { id: 3, name: "Sopravvivere fino a domani" },
  { id: 4, name: "Scrivere una canzone" },
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

  const [positions, setPositions] = useState<{ [key: number]: Position }>(
    elements.reduce((acc, element) => {
      acc[element.id] = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Fallback center position
      return acc;
    }, {} as { [key: number]: Position })
  );

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setConstraints({
          left: 0,
          right: offsetWidth - 50, // Adjusted for bubble size
          top: 0,
          bottom: offsetHeight - 50,
        });

        // Update positions **only if they haven’t been set properly**
        setPositions((prevPositions) =>
          elements.reduce((acc, element) => {
            acc[element.id] = prevPositions[element.id]?.x
              ? prevPositions[element.id] // Keep previous if exists
              : {
                  x: Math.random() * (offsetWidth - 50),
                  y: Math.random() * (offsetHeight - 50),
                };
            return acc;
          }, {} as { [key: number]: Position })
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
          position={positions[element.id]}
          onPositionUpdate={handlePositionUpdate}
          color={colors[element.id % colors.length]}
          constraints={constraints}
        />
      ))}
    </div>
  );
}
