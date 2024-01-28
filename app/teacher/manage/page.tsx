"use client";
import ManageBookings from "@/app/components/ManageReservations";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const user = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("userData")) ||
        "{}"
    );

    if (user.priority != 2 && typeof window !== "undefined") {
      localStorage.clear();
      router.push("/");
    }
  }
  return (
    <>
      <ManageBookings />
    </>
  );
};

export default Page;
