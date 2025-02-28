"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface BubbleProps {
  element: { id: number; name: string };
  position: { x: number; y: number };
  onPositionUpdate: (id: number, newPosition: { x: number; y: number }) => void;
  color: string;
  constraints: { left: number; right: number; top: number; bottom: number };
}

export default function Bubble({ element, position, onPositionUpdate, color, constraints }: BubbleProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [animatedPosition, setAnimatedPosition] = useState(position);

  useEffect(() => {
    if (!hasStarted) {
      const initialVelocity = {
        vx: (Math.random() - 0.5) * 300, // Random horizontal push
        vy: (Math.random() - 0.5) * 300, // Random vertical push
      };

      setAnimatedPosition({
        x: position.x + initialVelocity.vx,
        y: position.y + initialVelocity.vy,
      });

      setHasStarted(true);
    }
  }, [hasStarted, position]);

  return (
    <motion.div
      className="flex items-center justify-center rounded-full text-white cursor-pointer absolute"
      style={{
        width: 50,
        height: 50,
        backgroundColor: color,
      }}
      drag
      dragConstraints={constraints}
      dragElastic={0.1}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: animatedPosition.x, y: animatedPosition.y }}
      onDragEnd={(_, info) => {
        onPositionUpdate(element.id, { x: info.point.x, y: info.point.y });
      }}
      whileHover={{ scale: 1.5 }}
      whileTap={{ scale: 1.5 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.span
        className="text-m font-semibold text-center font-poppins"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ opacity: 1 }}
      >
        {element.name}
      </motion.span>
    </motion.div>
  );
}
