import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-2xl text-[#00af78] dark:text-[#68f4c7]"
          >
            Formzupp
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-emerald-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/forms"
              className="text-muted-foreground hover:text-emerald-300  transition-colors"
            >
              Forms
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
