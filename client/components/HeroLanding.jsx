"use client";
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
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?"
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
        "hello@mainframe.co"
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

      <div className="fixed inset-0 bg-black/10 z-0" />

      {/* NAVBAR */}

      <header className="fixed inset-x-0 top-0 z-10 px-5 sm:px-8 py-5">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <span
              className="text-[21px] sm:text-[26px] text-black tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
              }}
            >
              Mainframe®
            </span>

            <span className="text-[25px] sm:text-[30px] text-black">
              ✳︎
            </span>
          </div>

          <div className="hidden md:flex items-center text-[23px] text-black">
            <a href="#" className="hover:opacity-60">
              Labs
            </a>
            <span>,&nbsp;</span>

            <a href="#" className="hover:opacity-60">
              Studio
            </a>
            <span>,&nbsp;</span>

            <a href="#" className="hover:opacity-60">
              Openings
            </a>
            <span>,&nbsp;</span>

            <a href="#" className="hover:opacity-60">
              Shop
            </a>
          </div>

          <a
            href="#"
            className="hidden md:block text-[23px] underline"
          >
            Get in touch
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-[5px]"
          >
            <div
  className={`flex flex-wrap transition-all duration-500 ${
    showActions
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-2"
  }`}
>

  <Link
    href="/"
    className="
      mx-[0.2em]
      mb-[0.4em]
      rounded-full
      bg-black
      text-white
      px-5
      py-2
      text-sm
      hover:bg-white
      hover:text-black
      transition
    "
  >
    Explore →
  </Link>

  {[
    "Pitch us an idea",
    "Come work here",
    "Send a brief hello",
    "See how we operate",
  ].map((item) => (
    <button
      key={item}
      className="
        mx-[0.2em]
        mb-[0.4em]
        rounded-full
        bg-white
        border
        border-black/10
        px-5
        py-2
        text-black
        text-sm
        hover:bg-black
        hover:text-white
        transition
      "
    >
      {item}
    </button>
  ))}
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
          </button>
        </div>
      </header>

      {/* HERO */}

      <section className="relative z-[1] h-screen flex flex-col justify-end md:justify-center px-5 sm:px-8 md:px-10 pb-12 md:pb-0">

        <div className="max-w-xl">

          <div
            className="mb-6 select-none text-black"
            style={{
              filter: "blur(4px)",
              fontSize: "clamp(18px,4vw,26px)",
              lineHeight: "1.3",
            }}
          >
            <div>Hey there, meet A.R.I.A,</div>

            <div>
              Mainframe's Adaptive Response
              Interface Agent
            </div>
          </div>

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

          <div
            className={`flex flex-wrap transition-all duration-500 ${
              showActions
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {[
              "Pitch us an idea",
              "Come work here",
              "Send a brief hello",
              "See how we operate",
            ].map((item) => (
              <button
                key={item}
                className="mx-[0.2em] mb-[0.4em] rounded-full bg-white border border-black/10 px-5 py-2 text-black text-sm hover:bg-black hover:text-white transition"
              >
                {item}
              </button>
            ))}

            <button
              onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] rounded-full border border-white px-5 py-2 text-white hover:bg-white hover:text-black transition"
            >
              Reach us:
              <span className="underline ml-1">
                hello@mainframe.co
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

