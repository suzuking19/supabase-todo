import { z } from "zod";

export const CreateTodoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).trim(),
  user_id: z.string().optional(),
});
