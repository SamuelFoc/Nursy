"use client";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function LogoutButton({ className }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.replace("/admin/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className={`w-full max-w-52 rounded-xl bg-white text-black font-semibold py-3 mt-4  ${
        className ?? ""
      }`}
    >
      Logout
    </button>
  );
}
