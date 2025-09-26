import useSessionId from "@/hooks/useSessionId";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function ToggleMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const sessionId = useSessionId();

  return (
    <div className="z-50">
      <button onClick={() => setOpen(!open)} className="hover:text-gray-400">
        <Menu size={32} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-95 pt-28 flex flex-col items-center justify-start space-y-20 text-white text-4xl">
          {/* Close button inside overlay */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-8 right-8 hover:text-gray-400"
          >
            <X size={32} />
          </button>

          <a
            href={`/queue/${sessionId}`}
            className="hover:text-gray-400 transition-colors"
          >
            Home
          </a>
          <a href={"/queue/"} className="hover:text-gray-400 transition-colors">
            Queue
          </a>
        </div>
      )}
    </div>
  );
}
