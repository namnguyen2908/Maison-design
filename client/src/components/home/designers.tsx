"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const designers = [
  {
    name: "Nguyễn Minh Anh",
    role: "Senior Interior Designer",
    desc: "10 năm kinh nghiệm trong thiết kế căn hộ cao cấp.",
    color: "from-[#8B7355] to-[#6D5A3F]",
  },
  {
    name: "Trần Hoàng Long",
    role: "Architectural Designer",
    desc: "Chuyên gia không gian mở và ánh sáng tự nhiên.",
    color: "from-[#6D5A3F] to-[#4A3F35]",
  },
  {
    name: "Lê Phương Thảo",
    role: "Lead Designer",
    desc: "Phong cách tối giản hiện đại, đậm chất Nhật Bản.",
    color: "from-[#8A8478] to-[#6D5A3F]",
  },
  {
    name: "Đặng Hoàng Nam",
    role: "Project Manager",
    desc: "Đồng bộ hóa quy trình từ thiết kế đến thi công.",
    color: "from-[#4A3F35] to-[#2C2822]",
  },
];

export function DesignersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-surface px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Đội ngũ thiết kế
          </p>
          <h2 className="text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl">
            Được dẫn dắt bởi
            <br />
            <span className="font-medium">những nhà thiết kế tài năng.</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {designers.map((designer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group"
            >
              <div
                className={`aspect-[3/4] w-full rounded-3xl bg-gradient-to-br ${designer.color} transition-transform duration-500 group-hover:scale-[1.02]`}
              >
                <div className="flex h-full items-end p-6">
                  <div className="text-white">
                    <p className="text-sm font-medium text-white/60">{designer.role}</p>
                    <p className="mt-1 text-lg font-medium">{designer.name}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-secondary">
                {designer.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
