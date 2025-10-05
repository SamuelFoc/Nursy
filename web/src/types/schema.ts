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
  seq: z.number().nullable().optional(),
  called: z.boolean().nullable().optional(),
  num_calls: z.number().default(0),
  called_at: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  resolved: z.boolean().default(false),
  resolved_at: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  chat: ChatSchema.nullable().optional(),
  agent_id: z.string().nullable().optional(),
  agent_flag: z.string().nullable().optional(),
  agent_anamnesis: z.string().nullable().optional(),
  agent_diagnosis: z.string().nullable().optional(),
  agent_suggestion: z.string().nullable().optional(),
  agent_done: z.boolean().nullable().optional(),
});
export type Participant = z.infer<typeof ParticipantSchema>;

export const PublicQueueSchema = z.object({
  queue: z.array(z.int())
})
export type PublicQueue = z.infer<typeof PublicQueueSchema>