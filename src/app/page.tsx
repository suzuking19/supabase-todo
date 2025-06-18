import { signOut, createTodo } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { Todo } from "@/types/todo";

export default async function Home() {
  const supabase = await createClient();

  // 現在のユーザーを取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("ユーザー認証エラー:", userError);
    return <div>認証が必要です</div>;
  }

  // ユーザーのTODOのみを取得
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`fetch todos failed with :${error}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-2">Todo App</h1>
            <p className="text-gray-500 text-sm">シンプルなタスク管理</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200 bg-white/50 backdrop-blur-sm"
            >
              サインアウト
            </button>
          </form>
        </header>

        <main className="space-y-8">
          {/* Todo追加セクション */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              新しいタスクを追加
            </h2>
            <form action={createTodo} className="flex gap-3">
              <input
                type="text"
                name="title"
                placeholder="タスクを入力してください..."
                required
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors duration-200 text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors duration-200 font-medium"
              >
                追加
              </button>
            </form>
          </div>

          {/* Todoリストセクション */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">タスク一覧</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {todos && todos.length > 0 ? (
                todos.map((todo: Todo) => (
                  <li
                    key={todo.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">
                        {todo.title}
                      </span>
                      <div className="text-xs text-gray-400">
                        {/* 将来的に完了ボタンや削除ボタンを追加する場合のスペース */}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-gray-500">
                  まだタスクがありません。上記から新しいタスクを追加してください。
                </li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
