"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Safari } from "../magicui/safari";
import { useEffect, useState } from "react";

export default function SafariDemo() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const [windowSize, setWindowSize] = useState({
    width: 1200,
    height: 800,
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    setIsHydrated(true);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stableAnimations = Array.from({ length: 8 }, (_, i) => ({
    id: `beams-${i}`,
    left: ((i + 1) * 12.5) % 100,
    duration: 8 + (i % 3),
    delay: i * 0.5,
  }));

  const stableParticles = Array.from({ length: 12 }, (_, i) => ({
    id: `particle-${i}`,
    initialX: ((i + 1) * 8.33) % 100,
    initialY: ((i + 1) * 6.67) % 100,
    duration: 12 + (i % 5),
    delay: i * 0.4,
  }));

  return (
    <div className="min-h-screen mt-20 pt-20 bg-white dark:bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        {stableAnimations.map((anim) => (
          <motion.div
            key={anim.id}
            animate={
              isHydrated
                ? {
                    y: [-20, windowSize.height + 20],
                    opacity: [0, 0.6, 0],
                  }
                : {}
            }
            transition={
              isHydrated
                ? {
                    duration: anim.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: anim.delay,
                    ease: "linear",
                  }
                : {}
            }
            className="absolute w-0.5 h-8"
            style={{
              left: `${anim.left}%`,
              background: `linear-gradient(to bottom, transparent, #00e599, transparent)`,
              borderRadius: "50px",
              filter: "blur(0.5px)",
            }}
          />
        ))}

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "#00e599" }}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: "#00e599" }}
        />

        {stableParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: (particle.initialX / 100) * windowSize.width,
              y: (particle.initialY / 100) * windowSize.height,
              opacity: 0,
            }}
            animate={
              isHydrated
                ? {
                    x:
                      (((particle.initialX + 20) % 100) / 100) *
                      windowSize.width,
                    y:
                      (((particle.initialY + 30) % 100) / 100) *
                      windowSize.height,
                    opacity: [0, 0.4, 0],
                  }
                : {}
            }
            transition={
              isHydrated
                ? {
                    duration: particle.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: particle.delay,
                    ease: "linear",
                  }
                : {}
            }
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              backgroundColor: "#00e599",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          style={{ y, opacity }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            <span className="text-black dark:text-white">Where smart</span>
            <br />
            <span className="text-black dark:text-white">forms begin.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            AI-powered form builder that transforms the way you collect data.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
            y: 50,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.6,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.02,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          className="relative"
        >
          <Safari className="w-full h-auto" />
        </motion.div>
      </div>
    </div>
  );
}
