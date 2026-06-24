"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const steps = [
  { label: "Tư vấn", description: "Hiểu nhu cầu và phong cách của bạn" },
  { label: "Concept", description: "Định hình ý tưởng tổng thể" },
  { label: "Thiết kế", description: "Lên bản vẽ chi tiết" },
  { label: "Xem xét", description: "Duyệt và góp ý trực tiếp" },
  { label: "Chỉnh sửa", description: "Hoàn thiện theo phản hồi" },
  { label: "Phê duyệt", description: "Chốt phương án cuối cùng" },
  { label: "Bàn giao", description: "Hiện thực hóa không gian" },
];

export function ApproachSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="approach" ref={ref} className="bg-surface px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Giải pháp
          </p>
          <h2 className="max-w-3xl text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl">
            Một quy trình rõ ràng
            <br />
            <span className="font-medium">cho mọi quyết định.</span>
          </h2>
        </motion.div>

        <div className="mt-20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group flex items-start gap-6 border-b border-border-light py-8 last:border-b-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {i + 1}
              </span>
              <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-medium text-text">{step.label}</h3>
                  <p className="mt-1 text-secondary">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <svg
                    className="mt-4 hidden h-6 w-6 shrink-0 text-primary/40 sm:mr-8 sm:mt-0 sm:block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
