export type Role = "system" | "user" | "assistant";

export type ChatMessage = {
  role: Role;
  content: string;
};

export type Chat = {
  chat_id: string;
  history: ChatMessage[];
};