"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAxiosMutation } from "@/hooks/use-axios";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { trigger: register, isMutating: loading } = useAxiosMutation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await register({ url: "/api/auth/register", method: "POST", body: { name, email, password } });
      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "status" in (err as any)) {
        const apiErr = err as { status?: number; message?: string };
        if (apiErr.status === 409) {
          setError("Email này đã được đăng ký");
        } else {
          setError(apiErr.message ?? "Đã có lỗi xảy ra");
        }
      } else {
        setError("Không thể kết nối đến máy chủ");
      }
    }
  }

  return (
    <motion.div {...fadeUp(0)}>
      <div className="mb-10">
        <motion.h1 {...fadeUp(0.05)} className="text-3xl font-light tracking-tight text-text">
          Tạo tài khoản
        </motion.h1>
        <motion.p {...fadeUp(0.1)} className="mt-2 text-sm text-secondary">
          Bắt đầu hành trình thiết kế của bạn
        </motion.p>
      </div>

      <motion.form {...fadeUp(0.2)} onSubmit={handleSubmit} className="space-y-5">
        <div className="group relative">
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="peer h-14 w-full rounded-xl border border-border-light bg-surface px-4 pt-4 text-sm text-text outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute left-4 top-4 origin-left text-sm text-secondary/60 transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85]"
          >
            Họ và tên
          </label>
        </div>

        <div className="group relative">
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-14 w-full rounded-xl border border-border-light bg-surface px-4 pt-4 text-sm text-text outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-4 origin-left text-sm text-secondary/60 transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85]"
          >
            Email
          </label>
        </div>

        <div className="group relative">
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer h-14 w-full rounded-xl border border-border-light bg-surface px-4 pt-4 text-sm text-text outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-4 origin-left text-sm text-secondary/60 transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85]"
          >
            Mật khẩu
          </label>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={error ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          {error && (
            <p className="flex items-center gap-2 text-sm text-red-500">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </motion.div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang tạo tài khoản...
            </span>
          ) : (
            "Tạo tài khoản"
          )}
        </button>
      </motion.form>

      <motion.p {...fadeUp(0.35)} className="mt-10 text-center text-sm text-secondary">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary-dark">
          Đăng nhập
        </Link>
      </motion.p>
    </motion.div>
  );
}
