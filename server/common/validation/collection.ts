import z, { object, string } from "zod";

export const createCollectionSchema = object({
  name: string().min(4),
  description: string(),
  picture: string(),
});

export const listCollectionSchema = object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  orderBy: z.enum(["asc", "desc"]),
  status: z.enum(["available", "archived"]),
});

export type ICreateCollection = z.infer<typeof createCollectionSchema>;
export type IListCollection = z.infer<typeof listCollectionSchema>;
