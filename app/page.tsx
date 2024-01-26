"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("userData") || "{}");

      if (user.priority === 1) {
        router.push("/student");
      } else if (user.priority === 2) {
        router.push("/teacher");
      } else if (user.priority === 3) {
        router.push("/admin");
      } else {
        router.push("/auth/login");
      }
    }
  });

  return <></>;
}
