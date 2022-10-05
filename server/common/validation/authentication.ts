import z, { object, string } from "zod";

export const authenticationSchema = object({
  email: string().email(),
  password: string().min(12).max(100),
});

export const registerSchema = authenticationSchema.extend({
  username: string().email(),
});

export type IAuthenticate = z.infer<typeof authenticationSchema>;
export type IRegister = z.infer<typeof registerSchema>;
