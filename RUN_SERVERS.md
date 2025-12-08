# Running Frontend + Backend Together

## 🚀 Single Command to Run Everything

Just use this **ONE command**:

```bash
npm run dev
```

This will start **both**:
- ✅ **Frontend** (React + Vite) - cyan logs
- ✅ **Backend API** (Node.js + Express) - magenta logs

---

## What Runs

Running `npm run dev` starts:
1. **Frontend**: React app with Vite dev server
2. **Backend**: Node.js Express API server

Both servers run **simultaneously** with color-coded output:
- 🔵 **Frontend** logs in cyan
- 🔴 **Backend** logs in magenta

---

## Individual Commands (if needed)

### Run Frontend Only
```bash
npm run dev:frontend
```

### Run Backend Only
```bash
npm run dev:backend
```

---

## Quick Start

1. **Install dependencies** (one-time):
   ```bash
   npm install
   ```

2. **Configure backend** (one-time):
   ```bash
   cp api/.env.example api/.env
   # Edit api/.env with your credentials
   ```

3. **Run everything**:
   ```bash
   npm run dev
   ```

4. **Access your app**:
   - Frontend: `http://localhost:5173` (Vite default)
   - Backend API: `http://localhost:5000/api`
   - Health check: `http://localhost:5000/api/health`

---

## Stopping the Servers

Press `Ctrl+C` in the terminal - it will stop **both** servers at once.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run **both** frontend + backend |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm start` | Production frontend |
| `npm run start:backend` | Production backend |

---

## Notes

- All dependencies are in the **root** `node_modules` folder
- No separate `api/node_modules` - everything shares dependencies
- Backend uses the root dependencies via Node.js module resolution

That's it! Just **`npm run dev`** and you're ready! 🎉

