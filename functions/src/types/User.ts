import { z } from "zod";

import { timestampSchema } from "./shared.js";

export const userSchema = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string(),
  createdAt: timestampSchema(),
  photoURL: z.string().nullable(),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof userSchema>;
