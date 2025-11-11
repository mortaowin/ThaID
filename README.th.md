# 🚀 GOD-TIER MCP Server

**เซิร์ฟเวอร์ MCP ขั้นสูงแบบครบเครื่อง** ที่รองรับทั้ง ChatGPT Dev และ Claude Code พร้อมฟีเจอร์เต็มสูบ!

## ✨ ฟีเจอร์หลัก

- ✅ **MCP-compatible SSE** endpoint สำหรับ ChatGPT Dev
- ✅ **Anthropic API proxy** พร้อม **SSE streaming** (ใช้กับ Claude Code ได้เลย!)
- ✅ **Long-term memory (RAG)**: JSON vector store + OpenAI embeddings
- ✅ **Short-term memory**: Session-based ring buffer (เก็บประวัติ 50 ข้อความ)
- ✅ **Tool calling**: `web_fetch`, `file_read` พร้อม allowlist security
- ✅ **Bearer auth** + **Rate limiting** + **CORS** + **Request logging**
- ✅ **Zero external DB** - ทุกอย่างทำงานในเครื่อง

## 🎯 Quick Start

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment

คัดลอก `.env.example` เป็น `.env` แล้วใส่ API key:

```bash
cp .env.example .env
```

**แก้ไข `.env`:**
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx  # ← ใส่ API key ของคุณที่นี่
MODEL=gpt-4o-mini
PORT=8787
BEARER=dev-secret
RAG_PATH=./rag_store.json
ALLOW_WEB_FETCH=https://api.github.com,https://example.com
ALLOW_FILE_READ=./docs,./notes
```

### 3. รันเซิร์ฟเวอร์

```bash
npm run dev
```

หรือ

```bash
npx ts-node server.ts
```

## 🔌 ต่อกับ Claude Code (VS Code)

เปิด VS Code settings (`Ctrl+,` หรือ `Cmd+,`) แล้วเพิ่ม:

```json
{
  "anthropic.api_url": "http://localhost:8787",
  "anthropic.api_key": "test-key"
}
```

**หรือแก้ไข `settings.json` โดยตรง:**

1. กด `Ctrl+Shift+P` (หรือ `Cmd+Shift+P` บน Mac)
2. พิมพ์ `Preferences: Open User Settings (JSON)`
3. เพิ่ม:

```json
{
  "anthropic.api_url": "http://localhost:8787",
  "anthropic.api_key": "test-key"
}
```

ตอนนี้ **Claude Code จะเรียกใช้ GPT ผ่านเซิร์ฟเวอร์คุณ** พร้อม RAG memory และ tools!

## 🎮 ต่อกับ ChatGPT Dev (MCP)

1. ไปที่ ChatGPT Developer settings
2. สร้าง Connector ใหม่
3. ใส่ **MCP Server URL**: `http://localhost:8787/sse`
4. Authentication: ถ้าใช้ `BEARER` ให้ใส่ token

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:8787/health
```

### Query Endpoint (ถาม-ตอบพร้อม RAG)
```bash
curl -X POST http://localhost:8787/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{
    "text": "อธิบายการทำงานของ RAG หน่อย",
    "sessionId": "user-123"
  }'
```

### Anthropic Messages API (รองรับ streaming!)
```bash
curl -X POST http://localhost:8787/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": [{"type": "text", "text": "สวัสดีครับ"}]
      }
    ],
    "max_tokens": 1024,
    "stream": true
  }'
```

### อัดข้อมูลเข้า RAG
```bash
curl -X POST http://localhost:8787/admin/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{
    "text": "GPT-4o-mini เป็นโมเดลที่มีประสิทธิภาพสูงและราคาถูก เหมาะสำหรับงานทั่วไป",
    "meta": {
      "source": "manual",
      "category": "ai-models",
      "timestamp": "2025-11-11"
    }
  }'
```

### เรียกใช้ Tools

**Web Fetch:**
```bash
curl -X POST http://localhost:8787/tool/web_fetch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{"url": "https://api.github.com/users/octocat"}'
```

**File Read:**
```bash
curl -X POST http://localhost:8787/tool/file_read \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{"path": "./docs/example.txt"}'
```

## 🧠 การทำงานของ RAG Memory

1. **อัดข้อมูล**: ส่งเอกสารผ่าน `POST /admin/ingest`
2. **Embedding**: ระบบจะสร้าง vector จาก OpenAI embeddings
3. **เก็บ**: บันทึกลง JSON file (`rag_store.json`)
4. **ค้นหา**: เมื่อถามคำถาม ระบบจะ:
   - สร้าง embedding ของคำถาม
   - หา documents ที่คล้ายที่สุด (cosine similarity)
   - ใส่เป็น context ให้โมเดล
5. **ตอบ**: GPT จะตอบโดยอ้างอิง context จาก RAG

## 🛠️ ตัวอย่างการใช้งาน

### 1. อัดความรู้เกี่ยวกับโปรเจกต์
```bash
curl -X POST http://localhost:8787/admin/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{
    "text": "โปรเจกต์นี้ใช้ PostgreSQL 15 + Redis สำหรับ cache. Deploy บน AWS ECS. CI/CD ผ่าน GitHub Actions.",
    "meta": {"category": "infrastructure"}
  }'
```

### 2. ถามคำถาม
```bash
curl -X POST http://localhost:8787/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-secret" \
  -d '{
    "text": "เราใช้ database อะไรอยู่",
    "sessionId": "dev-team"
  }'
```

**Response:**
```json
{
  "sessionId": "dev-team",
  "answer": "ตาม context ที่มี โปรเจกต์ใช้ PostgreSQL 15 เป็น database หลัก และมี Redis สำหรับ cache ครับ"
}
```

## 🔐 Security Features

### Bearer Authentication
ตั้ง `BEARER` ใน `.env` เพื่อเปิดใช้งาน auth:
```env
BEARER=your-secret-token
```

ส่ง request ด้วย header:
```
Authorization: Bearer your-secret-token
```

### Allowlists

**Web Fetch**: จำกัด URL ที่ดึงได้
```env
ALLOW_WEB_FETCH=https://api.github.com,https://example.com,https://httpbin.org
```

**File Read**: จำกัดไดเรกทอรีที่อ่านได้
```env
ALLOW_FILE_READ=./docs,./notes,./data
```

### Rate Limiting
- **200 requests/minute** per IP
- ป้องกัน abuse + DDoS

## ⚙️ Environment Variables

| ตัวแปร | Default | คำอธิบาย |
|--------|---------|----------|
| `OPENAI_API_KEY` | *required* | API key จาก OpenAI |
| `MODEL` | `gpt-4o-mini` | โมเดลที่ใช้ |
| `EMBEDDING_MODEL` | `text-embedding-3-large` | โมเดล embedding สำหรับ RAG |
| `PORT` | `8787` | Port ของเซิร์ฟเวอร์ |
| `BEARER` | *optional* | Token สำหรับ auth (เว้นว่างเพื่อปิด) |
| `RAG_PATH` | `./rag_store.json` | ไฟล์เก็บ RAG data |
| `ALLOW_WEB_FETCH` | `""` | URL prefixes ที่อนุญาต (คั่นด้วย comma) |
| `ALLOW_FILE_READ` | `""` | ไดเรกทอรีที่อนุญาต (คั่นด้วย comma) |

## 🎨 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GOD-TIER MCP Server                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐   ┌──────────────┐  │
│  │  ChatGPT Dev │───▶│  SSE /sse    │   │ Claude Code  │  │
│  └──────────────┘    └──────────────┘   └───────┬──────┘  │
│                                                  │          │
│                                                  ▼          │
│                       ┌─────────────────────────────┐      │
│                       │ POST /v1/messages           │      │
│                       │ (Anthropic-compatible)      │      │
│                       │ - Non-streaming             │      │
│                       │ - SSE streaming ✨          │      │
│                       │ - Tool calling              │      │
│                       └────────┬────────────────────┘      │
│                                │                            │
│                                ▼                            │
│        ┌───────────────────────────────────────┐           │
│        │         OpenAI GPT-4o-mini            │           │
│        │     + Embeddings (RAG)                │           │
│        └───────────────────────────────────────┘           │
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │  Long-term      │         │  Short-term     │          │
│  │  Memory (RAG)   │         │  Memory         │          │
│  │  - JSON store   │         │  - Ring buffer  │          │
│  │  - Embeddings   │         │  - Per session  │          │
│  │  - Vector search│         │  - Max 50 msg   │          │
│  └─────────────────┘         └─────────────────┘          │
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │              Tools (Allowlist)               │          │
│  │  - web_fetch (HTTP GET)                     │          │
│  │  - file_read (Local files)                  │          │
│  └─────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'openai'"
```bash
npm install
```

### Error: "Unauthorized"
ตรวจสอบ header `Authorization: Bearer <token>` ว่าตรงกับ `BEARER` ใน `.env`

### Error: "Blocked by allowlist"
เพิ่ม URL หรือไดเรกทอรีใน `.env`:
```env
ALLOW_WEB_FETCH=https://api.github.com,https://your-domain.com
ALLOW_FILE_READ=./docs,./notes,./your-folder
```

### Claude Code ไม่เห็นเซิร์ฟเวอร์
1. ตรวจสอบว่าเซิร์ฟเวอร์รันอยู่: `curl http://localhost:8787/health`
2. ตรวจสอบ `settings.json`:
   ```json
   {
     "anthropic.api_url": "http://localhost:8787",
     "anthropic.api_key": "test-key"
   }
   ```
3. Restart VS Code

### ต้องการ streaming แต่ไม่ work
เพิ่ม `"stream": true` ใน request body:
```json
{
  "messages": [...],
  "stream": true
}
```

## 🚀 Advanced Features

### 1. Tool Calling จาก GPT
เซิร์ฟเวอร์รองรับ tool calling อัตโนมัติ - GPT จะเรียกใช้ tools เมื่อจำเป็น

### 2. Session Memory
ระบบจำประวัติการสนทนาได้ 50 ข้อความต่อ session:
```bash
curl -X POST http://localhost:8787/query \
  -H "Content-Type: application/json" \
  -d '{
    "text": "ชื่อผมอะไรหรอ",
    "sessionId": "user-123"
  }'
```

### 3. RAG Search
ค้นหาเอกสารที่เกี่ยวข้องอัตโนมัติผ่าน cosine similarity

### 4. Request Logging
ทุก request จะถูก log พร้อม:
- Timestamp
- Method + Path
- Status code
- Response time

## 📦 สำหรับ Production

แนะนำให้:
1. แยกไฟล์ออกเป็น modules
2. ใช้ Redis แทน in-memory sessions
3. ใช้ vector DB จริง (pgvector, Weaviate, Pinecone)
4. เพิ่ม OpenTelemetry สำหรับ tracing
5. Deploy บน Docker/Kubernetes
6. ใช้ HTTPS + Reverse proxy (Nginx/Caddy)

## 📝 License

MIT

## 🙏 Credits

สร้างด้วย ❤️ สำหรับ Thai dev community 🇹🇭

---

**มีคำถามหรือเจอบัค?** เปิด issue หรือ PR ได้เลย! 💪
