"use client";
import ManageRooms from "@/app/components/ManageRooms";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Page() {
  const router = useRouter();

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

  return (
    <div>
      <ManageRooms />
    </div>
  );
}

export default Page;
