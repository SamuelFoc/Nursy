import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AuthButton({ children, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      className="w-full rounded-xl bg-white text-black font-semibold py-3 mt-4 
                 hover:bg-zinc-200 transition-colors tracking-wide"
    >
      {children}
    </button>
  );
}
