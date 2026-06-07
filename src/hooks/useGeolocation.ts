"use client";
import { useState, useCallback } from "react";
import { nearestCity } from "@/lib/cities";

type GeoStatus = "idle" | "loading" | "success" | "denied" | "error";

interface UseGeolocationResult {
  status: GeoStatus;
  city: string | null;
  detect: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [city, setCity]     = useState<string | null>(null);

  const detect = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = nearestCity(pos.coords.latitude, pos.coords.longitude);
        setCity(found);
        setStatus("success");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { timeout: 8000, maximumAge: 60_000 }
    );
  }, []);

  return { status, city, detect };
}
