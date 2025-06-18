"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateTodoInput } from "@/types/todo";

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};

const createTodo = async (formData: FormData) => {
  const title = formData.get("title") as string;

  if (!title?.trim()) {
    console.error("タイトルが入力されていません");
    throw new Error("タイトルが入力されていません");
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

  const todoData: CreateTodoInput = { title: title.trim(), user_id: user.id };

  const { error } = await supabase.from("todos").insert(todoData);

  if (error) {
    console.error("Todoの作成中にエラーが発生しました:", error.message);
    throw new Error("Todoの作成に失敗しました");
  }

  // 成功時のみrevalidatePathを実行
  revalidatePath("/");
};

export { signOut, createTodo };
