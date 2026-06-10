"use client";

import { useEffect, useState } from "react";

export default function useTypewriter(
  text,
  speed = 38,
  startDelay = 600
) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;

    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        index++;

        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}