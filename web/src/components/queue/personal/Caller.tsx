import { ReactNode } from "react";

interface CallerProps {
  children: ReactNode;
}

export default function Caller({ children }: CallerProps) {
  return (
    <div className="bg-yellow-400 p-8 flex items-center justify-center text-2xl font-bold text-black rounded-2xl">
      {children}
    </div>
  );
}
