# 🚀 Godtier MCP Server

![MCP Server](https://raw.githubusercontent.com/mortaowin/ThaID/main/images/8.png)

[![GitHub Stars](https://img.shields.io/github/stars/mortaowin/ThaID?style=social)](https://github.com/mortaowin/ThaID)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A single-file TypeScript implementation of an MCP-compatible server with advanced features including SSE streaming, RAG memory, tool calling, and API routing.

---

## ✨ Features

- **MCP-compatible SSE endpoint** (`/sse`) for token streaming
- **Anthropic-compatible proxy** (`/v1/messages`) that routes to OpenAI GPT
- **Long-term memory (RAG)**: Local JSON vector store with OpenAI embeddings
- **Short-term session memory**: In-memory ring buffer per client
- **Tool calling**: Safe `web_fetch` and `file_read` with allowlists
- **Security**: Bearer auth, rate limiting, CORS
- **Zero external DB required**: Everything runs locally

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

**Required configuration:**
- `OPENAI_API_KEY`: Your OpenAI API key (get from https://platform.openai.com)
- Update `ALLOW_FILE_READ` paths to actual directories you want to allow

Example `.env`:
```env
OPENAI_API_KEY=sk-your-actual-key-here
MODEL=gpt-4o-mini
PORT=8787
BEARER=dev-secret
RAG_PATH=./rag_store.json
ALLOW_WEB_FETCH=https://api.github.com,https://example.com
ALLOW_FILE_READ=./docs,./notes
```

### 3. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:8787`

## API Endpoints

### Health Check
```bash
GET /health
```

### MCP SSE Endpoint
```bash
GET /sse?session=your-session-id
```

### Query Endpoint
```bash
POST /query
Content-Type: application/json

{
  "text": "Your question here",
  "sessionId": "optional-session-id"
}
```

### Anthropic Messages API (Compatible with Claude)
```bash
POST /v1/messages
Authorization: Bearer dev-secret
Content-Type: application/json

{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": [{"type": "text", "text": "Hello"}]
    }
  ],
  "max_tokens": 1024
}
```

### Tool Endpoints

**Web Fetch:**
```bash
POST /tool/web_fetch
Authorization: Bearer dev-secret
Content-Type: application/json

{
  "url": "https://api.github.com/users/octocat"
}
```

**File Read:**
```bash
POST /tool/file_read
Authorization: Bearer dev-secret
Content-Type: application/json

{
  "path": "./docs/example.txt"
}
```

### RAG Admin

**Ingest document:**
```bash
POST /admin/ingest
Authorization: Bearer dev-secret
Content-Type: application/json

{
  "text": "Your document content here",
  "meta": {
    "source": "manual",
    "timestamp": "2025-11-11"
  }
}
```

## Integration Examples

### ChatGPT Dev Integration
1. Go to ChatGPT Developer settings
2. Create new connector
3. Set MCP Server URL: `http://localhost:8787/sse`
4. Authentication: None (or add Bearer token if needed)

### Claude Code Integration
Set Anthropic API URL to: `http://localhost:8787`

### cURL Examples

**Query the server:**
```bash
curl -X POST http://localhost:8787/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{"text": "What is the meaning of life?"}'
```

**Ingest a document:**
```bash
curl -X POST http://localhost:8787/admin/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{"text": "AI is transforming software development.", "meta": {"category": "tech"}}'
```

## Security Notes

- **Bearer Token**: Set `BEARER` in `.env` to enable authentication on all endpoints
- **Web Fetch Allowlist**: Only URLs matching prefixes in `ALLOW_WEB_FETCH` can be fetched
- **File Read Allowlist**: Only files within directories in `ALLOW_FILE_READ` can be read
- **Rate Limiting**: 120 requests per minute per IP

## Configuration

All configuration is done via environment variables in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | *required* | Your OpenAI API key |
| `MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `EMBEDDING_MODEL` | `text-embedding-3-large` | Embedding model for RAG |
| `PORT` | `8787` | Server port |
| `BEARER` | *optional* | Bearer token for auth (leave empty to disable) |
| `RAG_PATH` | `./rag_store.json` | Path to RAG storage file |
| `ALLOW_WEB_FETCH` | `""` | Comma-separated list of allowed URL prefixes |
| `ALLOW_FILE_READ` | `""` | Comma-separated list of allowed directory paths |

## Architecture

This is a **single-file implementation** (`server.ts`) designed for simplicity and portability. For production use, consider splitting into modules:

- `server.ts` - Express server setup
- `rag.ts` - RAG storage and retrieval
- `tools.ts` - Tool implementations
- `memory.ts` - Session management
- `auth.ts` - Authentication middleware

## Troubleshooting

**Error: "Cannot find module 'openai'"**
- Run `npm install` to install dependencies

**Error: "Unauthorized"**
- Check that your `Authorization: Bearer <token>` header matches the `BEARER` value in `.env`

**Error: "Blocked by allowlist"**
- Add the URL or directory to the appropriate allowlist in `.env`

**TypeScript errors:**
- Ensure all dev dependencies are installed: `npm install -D typescript ts-node @types/node @types/express @types/cors @types/node-fetch`

## License

MIT
