import { z } from "zod";


export const RoleSchema = z.enum(["system", "user", "assistant", "verifier"]);
export type Role = z.infer<typeof RoleSchema>


export const MessageSchema = z.object({
    role: RoleSchema,
    content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;


export const ChatSchema = z.object({
    history: z.array(MessageSchema),
});
export type Chat = z.infer<typeof ChatSchema>;


export const ParticipantSchema = z.object({
  session_id: z.string(),
  seq: z.number(),
  chat: ChatSchema.nullable().optional(),
  agent_id: z.string().nullable().optional(),
  agent_flag: z.string().nullable().optional(),
  agent_suggestion: z.string().nullable().optional(),
  agent_diagnosis: z.string().nullable().optional(),
  agent_anamnesis: z.string().nullable().optional(),
});
export type Participant = z.infer<typeof ParticipantSchema>;

export const PublicQueueSchema = z.object({
  queue: z.array(z.int())
})
export type PublicQueue = z.infer<typeof PublicQueueSchema>