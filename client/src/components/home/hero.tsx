"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.98]);
  const timelineOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-text px-6"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,115,85,0.18)_0%,transparent_70%)]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1614] via-[#2C2822] to-[#3D352C] opacity-80" />

      <motion.div
        style={{ y: contentY, opacity, scale }}
        className="relative z-10 mx-auto max-w-[1200px] text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="mb-6 text-sm font-medium tracking-[0.3em] text-primary/80 uppercase">
            Maison — Nội thất minh bạch
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-5xl text-balance text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Thiết kế nội thất
          <br />
          <span className="font-medium text-primary">minh bạch</span> từ ý tưởng
          đến bàn giao
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-white/60 md:text-xl"
        >
          Theo dõi tiến độ, phản hồi trực tiếp trên thiết kế và đồng hành cùng
          đội ngũ thiết kế trong suốt dự án.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium tracking-wide text-white transition-all duration-500 hover:bg-primary-dark"
          >
            Bắt đầu dự án
          </Link>
          <a
            href="#approach"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-10 text-sm font-medium tracking-wide text-white/80 transition-all duration-500 hover:border-white/40 hover:text-white"
          >
            Khám phá quy trình
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ opacity: timelineOpacity }}
          className="mt-16 flex items-center justify-center gap-2 text-xs tracking-widest text-white/30 uppercase"
        >
          <span>Cuộc hẹn</span>
          <span className="h-px w-8 bg-white/20" />
          <span>Tư vấn</span>
          <span className="h-px w-8 bg-white/20" />
          <span>Thiết kế</span>
          <span className="h-px w-8 bg-white/20" />
          <span>Thi công</span>
          <span className="h-px w-8 bg-white/20" />
          <span>Bàn giao</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest text-white/30 uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
