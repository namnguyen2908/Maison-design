"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Section({ children, className = "", dark = false }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={`px-6 py-24 md:py-36 ${dark ? "bg-text text-bg" : "bg-bg text-text"} ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </motion.section>
  );
}
