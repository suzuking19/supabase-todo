"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CreateTodo } from "@/types";
import { CreateTodoSchema } from "@/libs/schemas";

const createTodo = async (formData: FormData) => {
  const title = formData.get("title") as string;

  const validationResult = CreateTodoSchema.safeParse({ title });

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.format();
    console.error("Validation error:", formattedErrors);

    const titleError = formattedErrors.title?._errors?.[0];
    throw new Error(titleError || "Invalid input data");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(`fetch user data failed with: ${userError}`);
    redirect("/login");
  }

  const todoData: CreateTodo = {
    title: validationResult.data.title,
    user_id: user.id,
    is_completed: false,
  };

  const { error } = await supabase.from("todos").insert(todoData);

  if (error) {
    console.error("Error occurred while creating todo:", error.message);
    throw new Error("Failed to create todo");
  }

  revalidatePath("/");
};

const deleteTodo = async (formData: FormData) => {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Todo ID is required");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(`fetch user data failed with: ${userError}`);
    redirect("/login");
  }

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error occurred while deleting todo:", error.message);
    throw new Error("Failed to delete todo");
  }

  revalidatePath("/");
};

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};

export { createTodo, deleteTodo, signOut };
