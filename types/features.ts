import { ReactNode } from "react";

export interface Feature {
  Icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  cta: string;
  background: ReactNode;
  className: string;
}
