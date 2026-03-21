"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TimelineScrollProps {
  children: React.ReactNode;
  className?: string;
}

export function TimelineScroll({ children, className = "" }: TimelineScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Timeline line container */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-px">
        {/* Background line */}
        <div className="absolute inset-0 bg-border/30" />
        {/* Animated progress line */}
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-primary/50"
          style={{ height: lineHeight }}
        />
        {/* Animated dot */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background ring-4 ring-primary/30 glow-blue-sm"
          style={{ top: lineHeight }}
        />
      </div>
      {children}
    </div>
  );
}

interface TimelineItemProps {
  children: React.ReactNode;
  isRight?: boolean;
  className?: string;
}

export function TimelineItem({ children, isRight = false, className = "" }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isRight ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative pl-8 md:pl-0 ${isRight ? "md:ml-[50%] md:pl-12" : "md:mr-[50%] md:pr-12 md:text-right"} ${className}`}
    >
      {/* Connection dot for mobile */}
      <div className="absolute left-0 top-6 w-3 h-3 rounded-full bg-primary/60 border-2 border-background md:hidden" />
      {/* Connection dot for desktop */}
      <div className={`hidden md:block absolute top-6 w-3 h-3 rounded-full bg-primary/60 border-2 border-background ${isRight ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`} />
      {children}
    </motion.div>
  );
}
