"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

// 定义组件接收的 props 类型
interface NewsletterTickerProps {
  title: string;
}

export default function NewsletterTicker({ title }: NewsletterTickerProps) {
  const newsletterText = useRef<HTMLDivElement | null>(null);
  let xPercent = 0;
  const animationDuration = 20;

  useEffect(() => {
    const ticker = newsletterText.current;

    if (ticker) {
      const tickerWidth = ticker.offsetWidth;

      gsap.set(ticker, { x: xPercent });

      const animation = gsap.to(ticker, {
        x: -tickerWidth,
        duration: animationDuration,
        ease: "linear",
        repeat: -1,
        onRepeat: () => {
          gsap.set(ticker, { x: 0 });
        },
      });

      return () => {
        animation.kill();
      };
    }
  }, [xPercent]);

  return (
      <div ref={newsletterText} className="flex bg-black text-white py-5">
      <span className="flex gap-2 pr-6">
        {[...Array(20)].map((_, index) => (
            <p key={index} className="font-semibold text-1xl uppercase">
              {title}
            </p>
        ))}
      </span>
      </div>
  );
}
