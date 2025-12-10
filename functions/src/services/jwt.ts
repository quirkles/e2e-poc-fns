import jwt from "jsonwebtoken";
import { z } from "zod";

import { getConfig } from "../config.js";

const tokenBodySchema = z.object({
  email: z.string(),
  firestoreId: z.string(),
  sqlId: z.string(),
});

export type TokenBody = z.infer<typeof tokenBodySchema>;

export function verifyToken(token: string): TokenBody {
  const tokenInfo = jwt.verify(token, getConfig().jwtSecret);
  return tokenBodySchema.parse(tokenInfo);
}
