"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const frustrations = [
  { text: "Không biết dự án đang ở đâu", desc: "Không có cách nào để kiểm tra tiến độ thiết kế một cách rõ ràng." },
  { text: "Chờ phản hồi nhiều ngày", desc: "Phải chờ đợi nhiều ngày để nhận được phản hồi từ đội ngũ thiết kế." },
  { text: "Góp ý qua hàng chục tin nhắn", desc: "Ý kiến bị phân tán qua email, Zalo, và nhiều kênh khác nhau." },
  { text: "Nhiều phiên bản thiết kế thất lạc", desc: "Không có nơi tập trung để quản lý các phiên bản thiết kế." },
];

function FrustrationItem({
  text,
  desc,
  index,
  total,
  scrollYProgress,
}: {
  text: string;
  desc: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const mid = (index + 0.5) / total;
  const end = (index + 1) / total;

  const opacity = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [start, start + 0.15], [40, 0]);
  const scale = useTransform(scrollYProgress, [start, mid, end], [0.95, 1, 0.95]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center"
    >
      <div className="flex w-full items-start gap-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-xl text-primary">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-2xl font-medium text-text md:text-3xl">{text}</p>
          <p className="mt-3 max-w-xl text-lg text-secondary/80">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const headingOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0.3]);
  const headingY = useTransform(scrollYProgress, [0, 0.08], [0, -20]);

  const labelOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative h-[420vh] bg-bg"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <motion.div style={{ opacity: labelOpacity }}>
            <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary uppercase">
              Vấn đề
            </p>
          </motion.div>

          <motion.div style={{ opacity: headingOpacity, y: headingY }}>
            <h2 className="text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl lg:text-7xl">
              Thiết kế nội thất
              <br />
              <span className="font-medium">không nên là một chiếc hộp đen.</span>
            </h2>
          </motion.div>

          <div className="relative mt-16 h-44 md:h-36">
            {frustrations.map((item, i) => (
              <FrustrationItem
                key={i}
                text={item.text}
                desc={item.desc}
                index={i}
                total={frustrations.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          <motion.div
            style={{ width: `${progress}%` }}
            className="mt-20 h-px bg-primary/30 transition-all duration-75"
          />
        </div>
      </div>
    </section>
  );
}
