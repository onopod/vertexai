# Chat System (React + streamText API)

本プロジェクトは、**React フロントエンド**と **Node.js バックエンド (Next.js API Route)** を用いて構築するシンプルなチャットシステムです。  
バックエンドでは **Vercel AI SDK の `streamText`** を利用し、OpenAI API を通じてストリーミングで応答を返却します。

---

## システム構成

- **フロントエンド**: React (Next.js App Router想定、任意のReact SPAでも可)
- **バックエンド**: Next.js API Routes または Express (例では Next.js)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs) の `streamText`
- **モデル提供元**: OpenAI API (`gpt-4o` など)
- **認証**: OpenAI API Key を `.env` ファイルに格納し、サーバーサイドから利用

---

## 要件

### 機能要件
1. ユーザーがフロントエンドからテキストを入力できること
2. バックエンドに入力が送信され、OpenAI API にプロンプトとして渡されること
3. OpenAI からの応答を **ストリーミング**でフロントに返却すること
4. フロントエンドでは応答が生成される途中から逐次表示できること
5. エラー発生時はエラーメッセージを返却・表示すること

### 非機能要件
- **環境変数管理**: OpenAI API Key は `process.env.OPENAI_API_KEY` で参照
- **セキュリティ**: API Key をフロントエンドに直接渡さない（必ずサーバー側で利用）
- **拡張性**: 将来的にツール呼び出しや複数モデル対応が可能なアーキテクチャにする

---

## 環境変数設定

プロジェクトルートに `.env.local` を作成し、以下を記述する:

```env
OPENAI_API_KEY=sk-xxxx...

