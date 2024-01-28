"use client";
import ManageBookings from "@/app/components/ManageReservations";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function page() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(
        (typeof window !== "undefined" && localStorage.getItem("userData")) ||
          "{}"
      );

      if (user.priority != 3 && typeof window !== "undefined") {
        localStorage.clear();
        router.push("/");
      }
    }
  });
  return <ManageBookings />;
}
