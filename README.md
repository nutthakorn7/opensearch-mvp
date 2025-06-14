# 🧪 OpenSearch MVP

ระบบ MVP (Minimum Viable Product) สำหรับค้นหาและแสดงผล Log จาก OpenSearch ด้วย Next.js + REST API

## 📌 จุดเด่น
- ✅ เขียนด้วย **Next.js 14** รวม Frontend และ Backend ในโปรเจกต์เดียว
- 🔐 ระบบ Login จริง (JWT Token เก็บใน Cookie)
- 🔎 ค้นหา Log จาก OpenSearch โดยแยกตาม tenant
- 🐳 พร้อมใช้ผ่าน Docker Compose
- ✨ เหมาะสำหรับ MSSP / SOC / ทีม DevSecOps
- 🔒 รองรับการตั้งค่า Security ของ OpenSearch
- 📱 Responsive Design รองรับทุกอุปกรณ์

---

## ⚙️ Stack ที่ใช้
| ส่วน         | เทคโนโลยี        |
|--------------|------------------|
| Frontend     | Next.js + React |
| Backend API | Next.js API Route |
| Auth         | JSON Web Token (JWT) |
| Search       | OpenSearch REST API |
| Container    | Docker Compose |
| Styling      | Tailwind CSS |

---

## 📁 โครงสร้างโปรเจกต์
```
opensearch-mvp/
├── pages/
│   ├── index.tsx          # หน้า Login
│   ├── dashboard.tsx      # หน้า Dashboard หลัง Login
│   └── api/
│       ├── login.ts       # API Login ออก JWT
│       └── search.ts      # API ค้น log จาก OpenSearch
├── .env.local             # ตัวแปร JWT + OpenSearch URL
├── Dockerfile             # ใช้รัน Next.js ใน container
├── docker-compose.yml     # รวม Next.js + OpenSearch
└── README.md
```

---

## 🚀 เริ่มต้นใช้งานแบบ Local (Dev)

### 1. เตรียม `.env.local`
```env
JWT_SECRET=changeme-secret
OPENSEARCH_URL=http://opensearch:9200
OPENSEARCH_USER=admin  # ถ้าเปิด Security
OPENSEARCH_PASS=admin  # ถ้าเปิด Security
```

### 2. ติดตั้งและรัน
```bash
npm install
npm run dev
```

### 3. เข้าระบบและดู Log
- URL: [http://localhost:3000](http://localhost:3000)
- Email: `user@example.com`
- Password: `test123`

---

## 🐳 ใช้งานผ่าน Docker Compose

```bash
docker-compose up --build
```

- Next.js app: [http://localhost:3000](http://localhost:3000)
- OpenSearch: [http://localhost:9200](http://localhost:9200)

### 📤 ส่ง Log ตัวอย่างเข้า OpenSearch
```bash
curl -XPOST 'http://localhost:9200/logs-tenant1-2025/_doc/' \
  -H 'Content-Type: application/json' \
  -d '{"@timestamp":"2025-06-15T12:00:00Z","message":"Test Log Entry","event.type":"error"}'
```

---

## 🔒 Security Considerations

### Production Deployment
1. เปลี่ยนค่า `JWT_SECRET` เป็นค่าที่ซับซ้อน
2. เปิดใช้งาน OpenSearch Security
3. ตั้งค่า HTTPS สำหรับ Next.js
4. ใช้ Reverse Proxy (เช่น Nginx)
5. ตั้งค่า Rate Limiting

### OpenSearch Security
```yaml
# docker-compose.yml
services:
  opensearch:
    environment:
      - discovery.type=single-node
      - plugins.security.disabled=false  # เปิด Security
      - OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m
```

---

## ✨ ฟีเจอร์ที่สามารถต่อยอดได้
- [ ] ระบบ Signup / Multi-user per tenant
- [ ] Export Log (CSV / JSON)
- [ ] แสดงกราฟ summary
- [ ] แจ้งเตือนผ่าน Line Notify / Webhook
- [ ] Integrate กับ Wazuh / Suricata / FortiGate log
- [ ] Role-based Access Control (RBAC)
- [ ] Audit Logging
- [ ] API Rate Limiting
- [ ] Log Retention Policy

---

## 👤 ติดต่อผู้พัฒนา
- GitHub: [nutthakorn7](https://github.com/nutthakorn7)
- สนับสนุนการใช้งานโดยทีม Cybersecurity & SOC Developer

> ระบบนี้ออกแบบให้สามารถนำไปใช้ได้จริงทั้ง Dev และ MSSP พร้อมขยายเป็น Production ได้ทันที 💪

## 📝 License
MIT License - ใช้ได้ฟรีทั้งส่วนตัวและองค์กร
Testing deployment
