"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const comments = [
  { x: 25, y: 35, author: "Minh Anh", text: "Mình nghĩ nên đổi màu trần này sang trắng kem." },
  { x: 60, y: 50, author: "Đức Huy", text: "Ghế sofa nên xoay về hướng cửa sổ để đón sáng." },
  { x: 75, y: 70, author: "Lan Chi", text: "Kệ gỗ có thể làm cao hơn 20cm để cân đối." },
];

export function ReviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-bg to-surface px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Phản hồi trực tiếp
          </p>
          <h2 className="text-4xl font-light leading-tight text-text sm:text-5xl md:text-6xl">
            Thấy điều cần thay đổi.
            <br />
            <span className="font-medium">Chỉ vào đó. Góp ý ngay.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary">
            Không cần email dài dòng. Không cần tin nhắn rời rạc. Mọi phản hồi
            đều gắn trực tiếp lên bản thiết kế.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#2C2822] shadow-2xl"
        >
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#3D352C] via-[#4A3F35] to-[#2C2822]">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-white/20">
                <svg className="mx-auto mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Bản vẽ thiết kế nội thất</p>
              </div>
            </div>
          </div>

          {comments.map((comment, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute"
              style={{ left: `${comment.x}%`, top: `${comment.y}%` }}
            >
              <div className="group relative">
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-lg transition-transform duration-300 hover:scale-110">
                  {i + 1}
                </div>
                <div className="absolute left-10 top-0 w-64 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="rounded-xl bg-surface p-4 shadow-2xl">
                    <p className="text-xs font-medium text-primary">{comment.author}</p>
                    <p className="mt-1 text-sm text-text">{comment.text}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-secondary">
            Di chuột vào các điểm đánh dấu để xem phản hồi
          </p>
        </motion.div>
      </div>
    </section>
  );
}
