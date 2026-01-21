"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // Default to 'user'
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get user type from URL query parameter
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "provider" || type === "user") {
      setUserType(type);
    }
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith("/")) {
      setRedirectPath(redirect);
    }
    const oauthError = searchParams.get("error");
    if (oauthError === "google_no_account") {
      setError(
        "No customer account found for this Google email. Please sign up first.",
      );
    } else if (oauthError === "google_login_failed") {
      setError("Google login failed. Please try again.");
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    const redirect = redirectPath || "/";
    const url = `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(redirect)}`;
    window.location.href = url;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("LoginForm - Starting login with userType:", userType);

    try {
      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials.",
        );
      }

      console.log("LoginForm - Login successful:", data);

      // Store auth token if provided by backend
      // Backend returns token in data.token
      const token = data.data?.token || data.token;
      if (token) {
        console.log("LoginForm - Storing token:", token);
        localStorage.setItem("authToken", token);
        console.log(
          "LoginForm - Token stored. Verifying:",
          localStorage.getItem("authToken"),
        );
      } else {
        console.error("LoginForm - No token received from backend!");
      }

      // Create user object from response
      // Backend returns user data in data.user
      const userData = data.data?.user || data.user;
      const user = {
        id: userData?.id || data.id,
        name:
          userData?.name ||
          userData?.firstName + " " + userData?.lastName ||
          email.split("@")[0],
        email: userData?.email || email,
        profileImage: userData?.profileImage || null,
        phone: userData?.phoneNumber || userData?.phone,
        address: userData?.address,
        role: userData?.role || userType,
      };

      console.log("LoginForm - Calling login with:", {
        user,
        userType: user.role,
      });

      // Call the login function with user data and userType
      login({ user, userType: user.role });

      // Redirect to requested page if provided (e.g., join-bundle), else role-based default
      const destination =
        redirectPath || (user.role === "provider" ? "/business" : "/");
      console.log("LoginForm - Redirecting to", destination);
      router.push(destination);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message || "An error occurred during login. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">
            Hello there, login to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-xs text-slate-500 hover:text-teal-600"
            >
              Forgot Password ?
            </a>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
        </div>

        {/* Create Account Link */}
        <p className="text-center text-slate-600 text-sm">
          <a
            href="/create-account"
            className="text-slate-700 hover:text-teal-600 underline font-medium"
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
            <div className="text-center text-slate-600">Loading...</div>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
