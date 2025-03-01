"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-blue p-4">
      <div className="p-6 bg-white rounded">
        <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex flex-col gap-2 justify-centeritems-center">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
          <Link
            href="/signup"
            className="w-full text-center p-2 text-black underline rounded disabled:bg-gray-400"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
