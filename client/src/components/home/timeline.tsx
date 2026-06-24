"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const milestones = [
  { label: "Tư vấn", completed: true },
  { label: "Concept", completed: true },
  { label: "Thiết kế", completed: true },
  { label: "Xem xét", completed: false, current: true },
  { label: "Chỉnh sửa", completed: false },
  { label: "Phê duyệt", completed: false },
  { label: "Bàn giao", completed: false },
];

const completedCount = milestones.filter((m) => m.completed).length;
const targetWidth = `${Math.round((completedCount / (milestones.length - 1)) * 100)}%`;

function MilestoneItem({
  item,
  index,
  scrollYProgress,
}: {
  item: (typeof milestones)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15 + index * 0.03],
    [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.15 + index * 0.03],
    [15, 0],
  );

  return (
    <motion.div style={{ opacity, y }} className="flex flex-col items-center">
      <div
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all duration-500 ${
          item.completed
            ? "border-primary bg-primary text-white"
            : item.current
              ? "border-primary bg-surface text-primary"
              : "border-border-light bg-surface text-secondary"
        }`}
      >
        {item.completed ? (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          index + 1
        )}
      </div>
      <p
        className={`mt-3 text-center text-xs font-medium ${
          item.current ? "text-primary" : "text-secondary"
        }`}
      >
        {item.label}
      </p>
    </motion.div>
  );
}

function StatsPanel({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="mt-12 grid gap-4 rounded-2xl bg-bg p-6 md:grid-cols-3"
    >
      <div>
        <p className="text-sm text-secondary">Đã hoàn thành</p>
        <p className="text-2xl font-medium text-text">3/7</p>
      </div>
      <div>
        <p className="text-sm text-secondary">Đang thực hiện</p>
        <p className="text-2xl font-medium text-primary">Xem xét</p>
      </div>
      <div>
        <p className="text-sm text-secondary">Dự kiến hoàn thành</p>
        <p className="text-2xl font-medium text-text">Quý 3, 2026</p>
      </div>
    </motion.div>
  );
}

export function TimelineSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", targetWidth]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [40, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.2, 1], [0.95, 1, 1]);

  return (
    <section ref={ref} className="bg-bg px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="mb-16 text-center"
        >
          <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Tiến độ dự án
          </p>
          <h2 className="text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl">
            Luôn biết <span className="font-medium">điều gì đang diễn ra.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary">
            Không cần hỏi. Không cần đoán. Mọi thứ đều hiển thị rõ ràng trên
            một màn hình duy nhất.
          </p>
        </motion.div>

        <motion.div style={{ scale: cardScale }} className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border-light bg-surface p-8 md:p-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Dự án hiện tại</p>
                <p className="text-xl font-medium text-text">Căn hộ The Marq</p>
              </div>
              <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Đang xem xét
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border-light" />

              <motion.div
                style={{ width: progressWidth }}
                className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-primary"
              />

              <div className="relative flex justify-between">
                {milestones.map((item, i) => (
                  <MilestoneItem
                    key={i}
                    item={item}
                    index={i}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>

            <StatsPanel scrollYProgress={scrollYProgress} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
