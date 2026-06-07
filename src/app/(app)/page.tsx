"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppPage() {
  const router = useRouter();

  useEffect(() => {
    const seen = localStorage.getItem("luuk-onboarding-seen");
    if (!seen) {
      router.replace("/onboarding");
    } else {
      router.replace("/pecas");
    }
  }, [router]);

  return null;
}
