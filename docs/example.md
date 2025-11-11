# ตัวอย่างข้อมูลสำหรับทดสอบ Tool: file_read

เอกสารนี้สร้างขึ้นเพื่อทดสอบการทำงานของ `file_read` tool

## ข้อมูลโปรเจกต์

- **ชื่อ**: GOD-TIER MCP Server
- **เวอร์ชัน**: 1.0.0
- **ภาษา**: TypeScript
- **Framework**: Express.js

## เทคโนโลยีที่ใช้

1. **OpenAI GPT-4o-mini** - โมเดลหลักสำหรับตอบคำถาม
2. **text-embedding-3-large** - สำหรับ RAG embeddings
3. **Express.js** - Web framework
4. **TypeScript** - Type-safe JavaScript
5. **Node.js** - Runtime environment

## ฟีเจอร์สำคัญ

- ✅ MCP-compatible SSE streaming
- ✅ Anthropic API proxy
- ✅ RAG memory with vector search
- ✅ Session-based short-term memory
- ✅ Secure tool calling with allowlists
- ✅ Bearer authentication
- ✅ Rate limiting (200 req/min)

## วิธีใช้งาน

```bash
# ติดตั้ง dependencies
npm install

# รันเซิร์ฟเวอร์
npm run dev

# Test health check
curl http://localhost:8787/health
```

## ติดต่อ

หากมีคำถามหรือต้องการความช่วยเหลือ สามารถเปิด issue ได้เลย!
