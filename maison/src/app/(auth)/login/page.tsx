"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
        className="opacity-30"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
        className="opacity-90"
        pathLength="1"
        strokeDashoffset="16"
      />
    </svg>
  );
}

const easeOut = [0.25, 0.1, 0.25, 1] as const;

function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error")
      ? "We couldn't sign you in. Please try again."
      : null
  );

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);
    window.location.href = "/api/auth/login/google";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="mb-14">
          <span className="text-2xl font-medium tracking-tight text-text">
            Maison
          </span>
        </div>

        <h1 className="text-3xl font-medium tracking-tight text-text">
          Welcome back
        </h1>
        <p className="mt-3 text-base text-secondary leading-relaxed">
          Sign in with your company Google account to continue.
        </p>

        <div className="mt-10">
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            whileTap={isLoading ? undefined : { scale: 0.98 }}
            className={`
              relative flex h-14 w-full items-center justify-center gap-3
              rounded-xl text-[15px] font-medium
              text-white
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg
              disabled:cursor-not-allowed
              ${isLoading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 active:shadow-md"
              }
            `}
            aria-label="Sign in with Google"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <LoadingSpinner />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <GoogleIcon className="h-5 w-5 shrink-0" />
                Continue with Google
              </span>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="mt-5 text-sm text-error/90 text-center"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <p className="mt-10 text-xs text-secondary/60 text-center leading-relaxed">
          Only authorized Maison team members
          <br />
          can access this workspace.
        </p>
        <p className="mt-2 text-xs text-secondary/40 text-center">
          Need access? Contact your administrator.
        </p>
      </motion.div>
    </>
  );
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-14">
        <span className="text-2xl font-medium tracking-tight text-text">
          Maison
        </span>
      </div>
      <div className="h-8 w-48 bg-border/50 rounded-md animate-pulse mb-3" />
      <div className="h-5 w-72 bg-border/50 rounded-md animate-pulse mb-10" />
      <div className="h-14 w-full bg-border/50 rounded-xl animate-pulse" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="fixed left-0 top-0 hidden lg:flex w-[60%] xl:w-[60%] 2xl:w-[60%] h-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/20 to-transparent" />

        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 25, ease: "easeOut" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
            alt="Premium interior design studio"
            fill
            preload={true}
            className="object-cover"
            sizes="60vw"
          />
        </motion.div>

        <div className="absolute bottom-16 left-16 z-20 max-w-lg">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: easeOut }}
            className="text-white/90 text-3xl sm:text-4xl font-light leading-tight tracking-tight"
          >
            Design exceptional
            <br />
            spaces together.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: easeOut }}
            className="text-white/50 text-xs sm:text-sm mt-4 tracking-[0.2em] uppercase"
          >
            Maison Interior Collaboration Platform
          </motion.p>
        </div>
      </div>

      <div className="ml-auto w-full lg:w-[40%] min-h-screen flex items-center justify-center p-8 lg:p-16 bg-bg">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
