import React from "react";

export function ShinyTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-100">
      {children}
    </div>
  );
}
