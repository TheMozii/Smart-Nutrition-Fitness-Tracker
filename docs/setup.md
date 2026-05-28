# Local Setup

## Prerequisites

- Python 3
- Node.js and npm
- PocketBase binary
- Project dependencies installed

## Environment

Create or update the root `.env` file:

```txt
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.2
```

Frontend environment variables are optional because the app has local defaults:

```txt
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
EXPO_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

For a web demo deployment without PocketBase, enable seeded demo records:

```txt
EXPO_PUBLIC_USE_DEMO_DATA=true
```

Demo mode stores test accounts and nutrition records in browser `localStorage`.
Users can register a demo account, sign in again after refresh, add/remove foods,
and keep demo nutrition records without deploying PocketBase. Food search and AI
analysis still use the backend API.

## Start PocketBase

From the project root:

```bash
/Users/ruvimsungeitis/Downloads/pocketbase_0.38.1_darwin_arm64/pocketbase serve --http 127.0.0.1:8090 --dir pb_data --migrationsDir pb_migrations
```

Dashboard:

```txt
http://127.0.0.1:8090/_/
```

## Start Backend

From `backend`:

```bash
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Health check:

```txt
http://127.0.0.1:8000/health
```

## Start Frontend

From `frontend`:

```bash
npm install
npm run web
```

Frontend:

```txt
http://127.0.0.1:8081
```

## Run Tests

Frontend:

```bash
cd frontend
npm run test
```

Backend:

```bash
cd backend
python3 -m unittest discover -s tests
```

## Reset Admin Password

From the project root:

```bash
/Users/ruvimsungeitis/Downloads/pocketbase_0.38.1_darwin_arm64/pocketbase superuser upsert admin@example.com password12345 --dir pb_data
```
