"use client";
import { PencilLine, Share2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: <PencilLine className="h-12 w-12 mb-6 " />,
      title: "Create a Form",
      description:
        "Use our intuitive drag-and-drop builder to design forms that match your workflow—no coding required.",
    },
    {
      icon: <Share2 className="h-12 w-12  " />,
      title: "Share Instantly",
      description:
        "Distribute your form via a unique link or embed it on your website. Collect responses in real time.",
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: "View Submissions",
      description:
        "Access and analyze your responses through a clean dashboard. Export data or integrate with your favorite tools.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 mt-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold  tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-300 dark:to-white animate-gradient-x  mb-4">
            How It Works
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Build, share, and manage forms effortlessly in three simple steps.
            Our platform is designed to simplify data collection and accelerate
            decisions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-emerald-200 dark:bg-emerald-300 z-0">
            <div className="absolute left-1/3 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-300"></div>
            <div className="absolute left-2/3 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-300"></div>
            <div className="absolute right-0 -translate-x-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-300"></div>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-background hover:border-emerald-200 hover:border-2 rounded-xl shadow-md p-8 text-center relative z-10 transition-all duration-500 transform-3d ease-in-out"
            >
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ">
                {step.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
