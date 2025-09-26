import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="relative w-full max-w-md mx-auto px-6 py-16 lg:px-12">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
}
