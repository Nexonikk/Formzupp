"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideFileAxis3D, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const components = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Forms",
    href: "/dashboard/forms",
  },
];

export function NavBar() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-b border-gray-200 dark:border-muted backdrop-blur-md py-4 sticky top-0 z-50"
    >
      <div className="container px-5 md:px-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px]">
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <LucideFileAxis3D className="text-[#92f8d8] h-5 w-5" />
                    <span className="font-semibold text-lg">Form Axis</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2">
                  {components.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:text-emerald-500"
                      >
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <LucideFileAxis3D className="text-emerald-500 h-5 w-5" />
            <span className="font-semibold text-lg">Formzupp</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <SignedOut>
            <SignInButton>
              <Button variant="ghost" className="main-btn">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button asChild variant="ghost" className="main-btn">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}
