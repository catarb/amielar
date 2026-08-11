"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MEDIA_DESCRIPTION = "Personas viviendo la experiencia Aire de Colmena dentro de la cabaña";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionPreference() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotionPreference() {
  return true;
}

export function AirHeroMedia() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    getServerReducedMotionPreference,
  );

  return (
    <>
      <span className="sr-only">{MEDIA_DESCRIPTION}</span>
      {prefersReducedMotion ? (
        <Image
          src="/A_13.png"
          alt=""
          fill
          priority
          className="site-photo-image object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 53vw"
        />
      ) : (
        <video
          className="site-photo-image absolute inset-0 h-full w-full object-cover object-center"
          src="/A_16.mp4"
          poster="/A_13.png"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </>
  );
}
