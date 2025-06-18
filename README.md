# Supabase Todo アプリ

Supabase Auth の Google 認証を使用した Todo アプリケーションです。
Next.js、TypeScript、Tailwind CSS を使用して構築されています。

## 技術スタック

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth)
- **スタイリング**: Tailwind CSS
- **バリデーション**: Zod
- **デプロイ**: Vercel

## 機能

- Google アカウントでのログイン/ログアウト
- Todo の作成、編集、削除
- Todo の完了/未完了の切り替え
- リアルタイムでのデータ同期

## データベーススキーマ

### todos テーブル

| カラム       | 型         | 説明                                    |
| ------------ | ---------- | --------------------------------------- |
| id           | uuid       | プライマリキー（自動生成）              |
| title        | text       | Todo のタイトル                         |
| is_completed | bool       | 完了状態（true: 完了, false: 未完了）   |
| user_id      | uuid       | ユーザー ID（auth.users.id の外部キー） |
| created_at   | timestampz | 作成日時                                |

- `user_id`は`auth.users`テーブルの`id`を参照する外部キー
- Row Level Security (RLS) により、各ユーザーは自分の Todo のみアクセス可能
