"use client";
import HeroLanding from "@/components/HeroLanding";

export default function LandingPage() {
  return <HeroLanding />;
}

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useTypewriter from "@/hooks/useTypewriter";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

export default function HeroLanding() {
  const videoRef = useRef(null);

  const prevX = useRef(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const { displayed, done } = useTypewriter(
    "Your next coding breakthrough might be one reel away."
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActions(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;

    const seekVideo = () => {
      if (!video.duration || seekingRef.current) return;

      seekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    };

    const handleMove = (e) => {
      if (!video.duration) return;

      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;

      const offset =
        (delta / window.innerWidth) *
        SENSITIVITY *
        video.duration;

      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + offset)
      );

      seekVideo();
    };

    const handleSeeked = () => {
      seekingRef.current = false;

      if (
        Math.abs(video.currentTime - targetTimeRef.current) >
        0.01
      ) {
        seekVideo();
      }
    };

    window.addEventListener("mousemove", handleMove);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(
        "hello@TechReel.co"
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          objectPosition: "70% center",
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

       <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-0" />
 
 {/* NAVBAR */}
<header className="fixed inset-x-0 top-0 z-20 px-5 sm:px-8 py-5">
  <div className="relative flex items-center justify-between">

    
     

   
    <div className="hidden md:flex items-center text-[23px] text-black">
      <a href="#" className="hover:opacity-60">
        Explore

      </a>
      <span>,&nbsp;</span>

     

      <a href="#" className="hover:opacity-60">
    
      Trending

      </a>
      <span>,&nbsp;</span>

      <a href="#" className="hover:opacity-60">

        Creators
      </a>
    </div>
 
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden flex flex-col gap-[5px]"
    >
      <span className="w-6 h-[2px] bg-black" />
      <span className="w-6 h-[2px] bg-black" />
      <span className="w-6 h-[2px] bg-black" />
    </button>

    <div className="mt-8">
  <Link
    href="/explore"
    className="
      inline-flex
      items-center
      rounded-full
      bg-white
      text-black
      px-8
      py-3
      font-medium
      hover:bg-black
      hover:text-white
      border
      border-white
      transition-all
      duration-300
    "
  >
    Explore TechReels →
  </Link>
</div>

     
    {menuOpen && (
      <div className="absolute top-14 right-0 w-72 rounded-3xl bg-white/90 backdrop-blur-md p-4 shadow-xl flex flex-col gap-3 md:hidden">
  
   

        {[
           [
            "Start Learning",
            "Explore Reels",
            "Browse Topics",
            "Join Community",
            ]
        ].map((item) => (
          <button
            key={item}
            className="rounded-full bg-white border border-black/10 px-5 py-3 text-black text-sm hover:bg-black hover:text-white transition"
          >
            {item}
          </button>
        ))}

       
      </div>
    )}
  </div>
</header>

      {/* HERO */}

      <section className="relative z-[1] h-screen flex flex-col justify-end md:justify-center px-5 sm:px-8 md:px-10 pb-12 md:pb-0">

        <div className="max-w-xl">

           

          <p
            className="mb-6 text-black"
            style={{
              fontSize: "clamp(18px,4vw,26px)",
              lineHeight: "1.35",
              minHeight: "54px",
            }}
          >
            {displayed}

            {!done && (
              <span className="cursor-blink ml-[2px]" />
            )}
          </p>

           
        </div>
      </section>
    </main>
  );
}
