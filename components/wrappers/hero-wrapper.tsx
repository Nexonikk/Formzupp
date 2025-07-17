"use client";
import { NavBar } from "./navbar";
import Footer from "./footer";

export function HeroWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex  min-h-screen flex-col pt-[4rem] items-center dark:bg-black bg-white justify-between">
        <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {children}
      </main>
      <Footer />
    </>
  );
}
