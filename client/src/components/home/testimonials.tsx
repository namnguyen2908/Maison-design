"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const testimonials = [
  {
    quote: "Trước đây tôi từng làm việc với 3 đơn vị thiết kế khác nhau. Maison là lần đầu tiên tôi thực sự thấy được mọi thứ đang diễn ra như thế nào.",
    author: "Chị Thu Hương",
    location: "The Marq, Quận 1",
  },
  {
    quote: "Phản hồi trực tiếp trên bản vẽ giúp tôi không cần giải thích đi giải thích một ý nhiều lần. Tiết kiệm ít nhất 2 tuần chỉnh sửa.",
    author: "Anh Quốc Bảo",
    location: "Sunwah Pearl, Bình Thạnh",
  },
];

const metrics = [
  { value: "70%", label: "Phản hồi nhanh hơn" },
  { value: "50%", label: "Giảm số lần chỉnh sửa" },
  { value: "100%", label: "Minh bạch trong tiến độ" },
];

export function TestimonialsSection() {
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
            Khách hàng nói gì
          </p>
          <h2 className="text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl">
            Trải nghiệm <span className="font-medium">thực tế.</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="rounded-3xl border border-border-light p-8 md:p-12"
            >
              <svg className="mb-6 h-8 w-8 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl leading-relaxed text-text md:text-2xl">
                {item.quote}
              </p>
              <div className="mt-8">
                <p className="font-medium text-text">{item.author}</p>
                <p className="text-sm text-secondary">{item.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-16 grid gap-8 rounded-3xl bg-bg p-8 md:grid-cols-3 md:p-12"
        >
          {metrics.map((metric, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-light text-primary md:text-5xl">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-secondary">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
