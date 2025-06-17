import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters"),
  
  content: z
    .string()
    .min(5, "Content is required")
    .max(500, "Content must be less than 500 characters"),
});
