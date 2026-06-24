"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    title: "Căn hộ The Marq",
    subtitle: "Quận 1, TP. Hồ Chí Minh",
    color: "from-[#3D352C] to-[#2C2822]",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Penthouse Sunwah Pearl",
    subtitle: "Bình Thạnh, TP. Hồ Chí Minh",
    color: "from-[#6D5A3F] to-[#4A3F35]",
    span: "",
  },
  {
    title: "Biệt thự Đà Lạt",
    subtitle: "Đà Lạt, Lâm Đồng",
    color: "from-[#8A8478] to-[#6D5A3F]",
    span: "",
  },
  {
    title: "Nhà phố Thảo Điền",
    subtitle: "Quận 2, TP. Hồ Chí Minh",
    color: "from-[#4A3F35] to-[#2C2822]",
    span: "md:col-span-2",
  },
  {
    title: "Căn hộ Diamond Island",
    subtitle: "Quận 7, TP. Hồ Chí Minh",
    color: "from-[#8B7355] to-[#6D5A3F]",
    span: "",
  },
];

function PortfolioItem({
  project,
  index,
  scrollYProgress,
}: {
  project: (typeof projects)[0];
  index: number;
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [0.05 + index * 0.02, 0.15 + index * 0.02],
    [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0.05 + index * 0.02, 0.15 + index * 0.02],
    [60, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0.05 + index * 0.02, 0.15 + index * 0.02],
    [0.92, 1],
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${project.color} ${project.span}`}
    >
      <div className="flex h-full items-end p-8">
        <div className="relative z-10">
          <p className="text-2xl font-medium text-white">{project.title}</p>
          <p className="mt-1 text-sm text-white/60">{project.subtitle}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/10" />
    </motion.div>
  );
}

export function PortfolioSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [40, 0]);

  return (
    <section ref={ref} className="bg-bg px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="mb-16"
        >
          <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Dự án tiêu biểu
          </p>
          <h2 className="text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl">
            Không gian <span className="font-medium">đã kiến tạo.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-[300px_300px]">
          {projects.map((project, i) => (
            <PortfolioItem
              key={i}
              project={project}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
