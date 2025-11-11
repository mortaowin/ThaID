# บันทึกการพัฒนา

## 2025-11-11

### เพิ่มฟีเจอร์
- ✅ เพิ่ม SSE streaming สำหรับ `/v1/messages`
- ✅ รองรับ Tool calling แบบอัตโนมัติ
- ✅ ปรับปรุง error handling และ logging
- ✅ เพิ่มคำแนะนำภาษาไทยใน README

### ปรับปรุง
- เพิ่ม request logging middleware
- เพิ่ม limit JSON payload เป็น 10MB
- ปรับ rate limit เป็น 200 req/min
- เพิ่ม console output แบบสวยงาม

### แผนต่อไป
- [ ] เพิ่ม WebSocket support สำหรับ real-time updates
- [ ] รองรับ multi-model (Anthropic, Gemini)
- [ ] เพิ่ม metrics และ monitoring
- [ ] สร้าง web UI สำหรับจัดการ RAG documents
- [ ] Export/Import RAG database
- [ ] Plugin system สำหรับ custom tools

## Tips & Tricks

### ทดสอบ Streaming
```bash
curl -N -X POST http://localhost:8787/v1/messages \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":[{"type":"text","text":"นับเลข 1-10"}]}],"stream":true}'
```

### อัด RAG จาก Text File
```bash
curl -X POST http://localhost:8787/admin/ingest \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"$(cat docs/example.md)\",\"meta\":{\"source\":\"docs/example.md\"}}"
```

### ดู RAG Documents
```bash
cat rag_store.json | jq '.docs[] | {id, meta}'
```
