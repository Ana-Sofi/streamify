import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import type { Credentials } from "../model/streamify.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>();
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<Credentials> = async (data) => {
    setError("");
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#e50914] mb-2 tracking-tight">
            STREAMIFY
          </h1>
          <p className="text-white/60 text-lg">Your gateway to entertainment</p>
        </div>

        {/* Login Form */}
        <div className="bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/60">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-white bg-[#e50914]/20 border border-[#e50914]/50 rounded-md backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-[#e50914] focus:ring-[#e50914]/20"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-[#e50914]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-[#e50914] focus:ring-[#e50914]/20"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-[#e50914]">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#e50914] hover:bg-[#b20710] text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-[#e50914]/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              New to Streamify?{" "}
              <Link
                to="/signup"
                className="text-white font-semibold hover:text-[#e50914] transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-8">
          This site is protected by reCAPTCHA and the Google Privacy Policy.
        </p>
      </div>
    </div>
  );
}
