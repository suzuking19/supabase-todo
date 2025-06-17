import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-light text-gray-900">Todo App</h1>
          <form action={signOut}>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              サインアウト
            </button>
          </form>
        </header>

        <main className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-light text-gray-600 mb-2">ようこそ</h2>
            <p className="text-gray-500">
              タスクを管理して、生産性を向上させましょう
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
