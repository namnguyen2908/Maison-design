"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="cta" ref={ref} className="bg-bg px-6">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-4xl bg-gradient-to-br from-[#2C2822] to-[#3D352C] px-8 py-24 text-center md:px-16 md:py-32"
        >
          <p className="mb-8 text-sm font-medium tracking-[0.3em] text-primary/80 uppercase">
            Bắt đầu ngay
          </p>

          <h2 className="text-3xl font-light leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Bắt đầu dự án tiếp theo
            <br />
            của bạn <span className="font-medium text-primary">cùng Maison.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            Đăng ký tư vấn miễn phí. Không cam kết. Không áp lực.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium tracking-wide text-white transition-all duration-500 hover:bg-primary-dark"
            >
              Bắt đầu dự án
            </Link>
            <a
              href="#"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-10 text-sm font-medium tracking-wide text-white/80 transition-all duration-500 hover:border-white/40 hover:text-white"
            >
              Gọi tư vấn
            </a>
          </div>
        </motion.div>

        <footer className="border-t border-border-light py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="text-xl font-medium text-text">Maison</p>
              <p className="mt-1 text-sm text-secondary">
                Thiết kế nội thất minh bạch
              </p>
            </div>
            <div className="flex gap-8 text-sm text-secondary">
              <a href="#" className="transition-colors hover:text-text">
                Về chúng tôi
              </a>
              <a href="#" className="transition-colors hover:text-text">
                Quy trình
              </a>
              <a href="#" className="transition-colors hover:text-text">
                Dự án
              </a>
              <a href="#" className="transition-colors hover:text-text">
                Liên hệ
              </a>
            </div>
            <p className="text-xs text-secondary/60">
              &copy; 2026 Maison. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
