"use client";

import { BentoDemo } from "@/components/bento-features";
import { Icons } from "@/components/icons";
import BlurIn from "@/components/magicui/blur-in";
import { BorderBeam } from "@/components/magicui/border-beam";
import ShineBorder from "@/components/magicui/shine-border";
import { Companies } from "@/components/social-proof";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function TypewriterInput() {
  const [currentText, setCurrentText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeedRef = useRef(150);
  const pauseRef = useRef(2000);

  const placeholders = [
    "Enter your website URL",
    "www.sangam.ai",
    "yourdomain.com"
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeWriter = () => {
      const currentPhrase = placeholders[currentPlaceholderIndex];
      
      if (isDeleting) {
        // Deleting phase
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        typingSpeedRef.current = 50; // Faster when deleting
        
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          timeout = setTimeout(typeWriter, 500); // Pause before typing next
        } else {
          timeout = setTimeout(typeWriter, typingSpeedRef.current);
        }
      } else {
        // Typing phase
        setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        typingSpeedRef.current = 150; // Normal typing speed
        
        if (currentText.length === currentPhrase.length) {
          setIsDeleting(true);
          timeout = setTimeout(typeWriter, pauseRef.current); // Pause at end
        } else {
          timeout = setTimeout(typeWriter, typingSpeedRef.current);
        }
      }
    };

    timeout = setTimeout(typeWriter, typingSpeedRef.current);
    return () => clearTimeout(timeout);
  }, [currentText, currentPlaceholderIndex, isDeleting]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-4">
      <input
        type="text"
        onFocus={() => (window.location.href = "/studio")}
        className="w-full px-6 py-5 text-xl bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none focus:ring-0 text-center"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-gray-400 dark:text-gray-500 text-xl">
          {currentText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "easeInOut"
            }}
            className="ml-1"
          >
            |
          </motion.span>
        </span>
      </div>
    </div>
  );
}

function HeroPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center sm:mb-10 lg:mb-20 md:sm-20">
          <ShineBorder
            className="text-center capitalize bg-muted px-4 py-1.5 text-lg font-medium absolute"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            Introducing SangamAI ✨
          </ShineBorder>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-20">
            Infusing website with a powerful conversational AI in one click
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            No Extra efforts. Full intelligence. Easiest way to upgrade your site.
          </p>

          {/* CTA Buttons + Input */}
          <div className="space-y-4">
            <div className="space-x-4">
              <Link
                href="/#features"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Let&apos;s Explore
              </Link>
              <a
                href="/studio"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-sm-2"
                )}
              >
                Get Started 👇🏻
              </a>
            </div>

            {/* Typewriter Animated Input */}
            <TypewriterInput />
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative rounded-xl mx-auto justify-center flex flex-col items-center lg:max-w-[1000px] overflow-hidden">
  <video
    className="w-full rounded-[inherit] border object-contain shadow-lg"
    src="/sangamAI-fast.mp4" // replace with your actual path
    autoPlay
    muted
    loop
    playsInline
  />
  <BorderBeam size={250} />
</div>

      </section>

      {/* Company Logos */}
      {/*<Companies />*/}

      {/* Features Section */}
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-10"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h3 className="text-center text-sm font-semibold text-gray-500 pb-2">
            FEATURES
          </h3>
        </div>
        <BentoDemo />
      </section>

      {/* Final CTA Section */}
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            SangamAI - Unlock the Impossibility
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Let&apos;s Try Now -{" "}
            <a href="/studio" className="underline underline-offset-4">
              Get Started
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

export default HeroPage;