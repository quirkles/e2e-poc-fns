import { z } from "zod";

export const userSchema = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string(),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof userSchema>;
