import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

export default function Section({ children }: SectionProps) {
  return <div className="flex flex-col pb-12">{children}</div>;
}
