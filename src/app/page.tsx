import {
  signOut,
  createTodo,
  deleteTodo,
  toggleTodo,
  deleteCompletedTodos,
} from "./actions";
import { createClient } from "@/utils/supabase/server";
import { Todo } from "@/types/todo";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  // 現在のユーザーを取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth Error with :", userError);
    redirect("/login");
  }

  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("is_completed", { ascending: true })
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

          {/* タスク統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {todos?.length || 0}
              </div>
              <div className="text-sm text-gray-500">総タスク数</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-green-600">
                {todos?.filter((todo) => todo.is_completed).length || 0}
              </div>
              <div className="text-sm text-gray-500">完了済み</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {todos?.filter((todo) => !todo.is_completed).length || 0}
              </div>
              <div className="text-sm text-gray-500">未完了</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {todos && todos.length > 0
                  ? Math.round(
                      (todos.filter((todo) => todo.is_completed).length /
                        todos.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-500">進捗率</div>
            </div>
          </div>

          {/* 完了済みタスク削除ボタン */}
          {todos && todos.some((todo) => todo.is_completed) && (
            <div className="flex justify-end">
              <form action={deleteCompletedTodos}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors duration-200 font-medium text-sm"
                >
                  完了済みタスクをすべて削除
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">タスク一覧</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {todos && todos.length > 0 ? (
                todos.map((todo: Todo) => (
                  <li
                    key={todo.id}
                    className={`p-6 transition-colors duration-150 ${
                      todo.is_completed ? "bg-gray-50/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <form action={toggleTodo} className="flex-shrink-0">
                        <input type="hidden" name="id" value={todo.id} />
                        <input
                          type="hidden"
                          name="is_completed"
                          value={todo.is_completed.toString()}
                        />
                        <button
                          type="submit"
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            todo.is_completed
                              ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                              : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                          }`}
                        >
                          {todo.is_completed && (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      </form>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-gray-900 font-medium transition-all duration-200 ${
                            todo.is_completed
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {todo.title}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(todo.created_at).toLocaleDateString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      <form action={deleteTodo} className="flex-shrink-0">
                        <input type="hidden" name="id" value={todo.id} />
                        <button
                          type="submit"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          title="削除"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    まだタスクがありません
                  </p>
                  <p className="text-gray-400 text-sm">
                    上記から新しいタスクを追加してください
                  </p>
                </li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
