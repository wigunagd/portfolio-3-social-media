'use client';

import { useAppSelector } from "@/redux/3_redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const authState = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoggedin || authState.accessToken === "") {
      router.push('/login');
    }
  }, [authState.accessToken, authState.isLoggedin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black">
      <main className="flex min-h-screen w-full max-w-360 flex-col items-center justify-center bg-black">
        Home
      </main>
    </div>
  );
}
