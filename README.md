# SecureMail Frontend (Next.js)

The management dashboard for the SecureMail ecosystem, built with Next.js 16 and React 19.

## ✅ Run Options

### 1. Via Turborepo (Root)
```bash
npm run dev:ui
```

### 2. Manual Execution
1. **Setup**:
   ```bash
   npm install
   ```
2. **Environment**: Ensure `.env.local` points to the Backend:
   `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. **Run**:
   ```bash
   npm run dev
   ```

---

## 🛠️ Features
- **Modern UI**: Built with Tailwind CSS and Framer Motion.
- **Microservice Integration**: Communicates with the NestJS backend on port 3000.
