import { Message } from "@/types/chat";

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content: "Hello, I am your virtual nurse. Can you tell me your full name?",
  },
];

export function nextNurseReply(history: Message[]): Message {
  const userInputs = history
    .filter((m) => m.role === "user")
    .map((m) => m.content.trim());
  const step = userInputs.length;

  let content = "Thank you.";
  if (step === 0)
    content = "Hello, I am your virtual nurse. Can you tell me your full name?";
  else if (step === 1) content = "Thanks. How old are you?";
  else if (step === 2)
    content = "Got it. What symptoms are you experiencing today?";
  else if (step === 3) content = "Any known allergies to medications or foods?";
  else if (step === 4)
    content = "Do you have any chronic conditions or current medications?";
  else content = "Thanks. A nurse will review this information shortly.";

  return { id: crypto.randomUUID(), role: "assistant", content };
}
