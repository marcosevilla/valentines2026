"use client";

import { useEffect, useRef, useCallback } from "react";

const MUSIC_SRC =
  "/music/Hereditary Soundtrack - \uFF02Reborn\uFF02 - Colin Stetson - Milan Records USA.mp3";
const TARGET_VOLUME = 0.65;
const FADE_DURATION = 800; // ms
const FADE_STEP = 16; // ~60fps

interface BackgroundMusicProps {
  playing: boolean;
  ducked: boolean;
  volume?: number;
}

export function BackgroundMusic({ playing, ducked, volume: volumeProp }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const fadeTo = useCallback((target: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }

    const startVolume = audio.volume;
    const diff = target - startVolume;
    if (Math.abs(diff) < 0.01) {
      audio.volume = target;
      return;
    }

    const steps = FADE_DURATION / FADE_STEP;
    const volumeStep = diff / steps;
    let step = 0;

    function tick() {
      if (!audioRef.current) return;
      step++;
      const newVolume = Math.min(1, Math.max(0, startVolume + volumeStep * step));
      audioRef.current.volume = newVolume;

      if (step < steps) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        audioRef.current.volume = target;
        fadeRef.current = null;
      }
    }

    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  // Start/stop playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => {
        // Autoplay blocked — will start on next user interaction
      });
    }
  }, [playing]);

  // Duck/unduck volume
  useEffect(() => {
    if (!playing) return;
    const target = ducked ? 0 : (volumeProp ?? TARGET_VOLUME);
    fadeTo(target);
  }, [ducked, playing, fadeTo, volumeProp]);

  return null;
}
