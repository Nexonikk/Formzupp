"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BrainIcon,
  FolderKanban,
  MessageSquare,
  Share2,
  Wand2,
} from "lucide-react";
import { ShinyTag } from "../ui/shiny-tag";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";
import { ReactNode } from "react";

interface Feature {
  Icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  cta: string;
  background: ReactNode;
  className: string;
}

const features: Feature[] = [
  {
    Icon: Wand2,
    name: "One-Prompt Form Generation",
    description:
      "Describe your needs in a single sentence. Our AI will instantly generate a complete, ready-to-use form with relevant questions.",
    href: "/dashboard",
    cta: "Try Now",
    background: (
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        variants={{
          initial: { rotate: -20, scale: 1.2, x: "0%", y: "0%" },
          animate: { rotate: 20, scale: 1.2, x: "20%", y: "10%" },
        }}
        className="absolute -right-20 -top-20 opacity-15 w-80 h-80 bg-emerald-500/80 rounded-full blur-3xl"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: MessageSquare,
    name: "Conversational Interface",
    description:
      "Engage users with a dynamic, chat-like experience that feels less like a form and more like a friendly conversation.",
    href: "/",
    cta: "See a Demo",
    background: (
      <div className="absolute top-0 left-0 w-full h-full p-6 overflow-hidden">
        <div className="relative w-full h-full flex flex-col justify-center gap-2">
          {[
            {
              delay: 0,
              side: "left",
              bg: "bg-gray-400/50 dark:bg-gray-600/50",
            },
            {
              delay: 1.5,
              side: "right",
              bg: "bg-emerald-500/50 dark:bg-emerald-600/50",
            },
            {
              delay: 3,
              side: "left",
              bg: "bg-gray-400/50 dark:bg-gray-600/50",
            },
            {
              delay: 4.5,
              side: "right",
              bg: "bg-emerald-500/50 dark:bg-emerald-600/50",
            },
          ].map((bubble, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{
                opacity: [0, 1, 1, 1, 0],
                scale: [0.8, 1, 1, 1, 0.8],
                y: [10, 0, 0, 0, 10],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: bubble.delay,
                ease: "easeOut",
                repeatDelay: 2,
              }}
              className={`w-28 h-8 ${
                bubble.side === "right" ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`
              ${bubble.bg} 
              w-full h-full
              rounded-2xl 
              shadow-sm
              ${bubble.side === "right" ? "rounded-br-md" : "rounded-bl-md"}
              blur-sm
            `}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: FolderKanban,
    name: "Manage Forms",
    description:
      "An intuitive dashboard to view, edit, and organize all your created forms in one centralized location.",
    href: "/dashboard",
    cta: "Go to Dashboard",
    background: (
      <div className="absolute -right-10 -bottom-10 opacity-15 w-60 h-60 bg-sky-500/80 rounded-full blur-3xl" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Share2,
    name: "Frictionless Sharing",
    description:
      "Generate a unique link for each form. Share it anywhere and start collecting responses instantly.",
    href: "/",
    cta: "Learn More",
    background: (
      <div className="absolute -left-10 -top-10 opacity-15 w-60 h-60 bg-indigo-500/80 rounded-full blur-3xl" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BarChart3,
    name: "Insightful Analytics",
    description:
      "Analyze responses with clear, visual data representations to gain valuable insights from your audience.",
    href: "/dashboard",
    cta: "View Analytics",
    background: (
      <div className="absolute bottom-0 left-0 w-full h-1/2 p-8 flex justify-start items-end">
        <div className="w-full flex items-end gap-2">
          <div className="w-1/4 h-12 rounded-t-lg bg-pink-500/40 blur-sm"></div>
          <div className="w-1/4 h-8 rounded-t-lg bg-pink-500/40 blur-sm"></div>
          <div className="w-1/4 h-16 rounded-t-lg bg-pink-500/40 blur-sm"></div>
          <div className="w-1/4 h-10 rounded-t-lg bg-pink-500/40 blur-sm"></div>
        </div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function Features() {
  return (
    <section className="py-24 overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="md:max-w-xl mb-16"
        >
          <div className="w-fit rounded-full border border-emerald-200 dark:border-emerald-200 bg-emerald-50 dark:bg-emerald-800 px-4 py-1 mb-6">
            <ShinyTag>
              <BrainIcon className="h-4 w-4" />
              <span>Human-centric Design</span>
            </ShinyTag>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-[#00e599] dark:to-white mb-4">
            Redefining Forms for the Modern Web.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Remove the friction of traditional forms with AI-powered forms into
            smart, conversational experiences, — making data collection feel
            like a natural dialogue, not a chore.
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
