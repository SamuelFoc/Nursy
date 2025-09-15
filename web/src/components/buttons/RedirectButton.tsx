import Link from "next/link";

type RedirectButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function RedirectButton({
  href,
  children,
}: RedirectButtonProps) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center justify-center px-8 py-3 
                 rounded-full border border-white text-white font-medium tracking-wide
                 transition-all duration-300 ease-out
                 hover:bg-white hover:text-black
                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
    >
      {children}
    </Link>
  );
}
