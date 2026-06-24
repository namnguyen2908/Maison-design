"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollProgressProps {
  children: (progress: MotionValue<number>) => ReactNode;
  className?: string;
}

export function ScrollProgress({
  children,
  className = "",
}: ScrollProgressProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  return (
    <div ref={ref} className={className}>
      {children(scrollYProgress)}
    </div>
  );
}
