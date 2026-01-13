import { z } from "zod";

export const timestampSchema = () =>
  z.object({
    seconds: z.number(),
    nanoseconds: z.number(),
  });
