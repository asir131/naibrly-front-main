"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProviderSignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/provider/signup/user_info");
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Redirecting…
        </h1>
        <p className="text-slate-500 text-sm">
          Taking you to the provider signup flow.
        </p>
      </div>
    </div>
  );
}
