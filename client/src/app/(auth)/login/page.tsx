"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginLocal, googleLoginUrl, facebookLoginUrl } from "@/lib/api";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginLocal(email, password);
      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosErr.response?.status === 401) {
          setError("Email hoặc mật khẩu không đúng");
        } else {
          setError(axiosErr.response?.data?.message ?? "Đã có lỗi xảy ra");
        }
      } else {
        setError("Không thể kết nối đến máy chủ");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div {...fadeUp(0)}>
      <div className="mb-10">
        <motion.h1 {...fadeUp(0.05)} className="text-3xl font-light tracking-tight text-text">
          Đăng nhập
        </motion.h1>
        <motion.p {...fadeUp(0.1)} className="mt-2 text-sm text-secondary">
          Đăng nhập để quản lý dự án của bạn
        </motion.p>
      </div>

      <motion.form {...fadeUp(0.2)} onSubmit={handleSubmit} className="space-y-5">
        <div className="group relative">
          <input
            ref={emailRef}
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

        <div className="flex items-center justify-end">
          <button
            type="button"
            className="text-xs text-secondary/60 transition-colors hover:text-primary"
          >
            Quên mật khẩu?
          </button>
        </div>

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
              Đang đăng nhập...
            </span>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </motion.form>

      <motion.div {...fadeUp(0.3)} className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-bg px-4 text-xs text-secondary/60 uppercase tracking-[0.15em]">
            Hoặc
          </span>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.35)} className="space-y-3">
        <a
          href={googleLoginUrl}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border-light bg-surface text-sm font-medium text-text transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Đăng nhập với Google
        </a>

        <a
          href={facebookLoginUrl}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border-light bg-surface text-sm font-medium text-text transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Đăng nhập với Facebook
        </a>
      </motion.div>

      <motion.p {...fadeUp(0.4)} className="mt-10 text-center text-sm text-secondary">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary-dark">
          Đăng ký
        </Link>
      </motion.p>
    </motion.div>
  );
}
