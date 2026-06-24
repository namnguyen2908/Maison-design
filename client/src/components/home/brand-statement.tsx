"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";

export function BrandStatementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-text px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,115,85,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[1200px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-4xl font-light leading-tight text-bg sm:text-5xl md:text-6xl lg:text-7xl">
            Không chỉ là
            <br />
            <span className="font-medium">thiết kế đẹp.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.01, delay: 0.6 }}
          className="mt-8"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-2xl font-light text-primary sm:text-3xl md:text-4xl"
          >
            Là sự minh bạch trong từng quyết định.
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-12 max-w-2xl text-lg leading-relaxed text-white/50"
        >
          Mỗi bản vẽ, mỗi lần chỉnh sửa, mỗi quyết định — đều được ghi lại,
          hiển thị và trao đổi trong cùng một không gian. Không có gì bị che
          giấu. Không có gì bị thất lạc.
        </motion.p>
      </div>
    </section>
  );
}
