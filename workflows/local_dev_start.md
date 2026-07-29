---
description: Start the full local development stack (Backend + Frontend)
---

This workflow assumes you have terminals available.

1. Start the Backend (Python)
   // turbo
   Run command: `cd conekiller_server && set USE_MOCK_DB=true && uvicorn main:app --reload`
   *Note: Using Mock DB for offline development.*

2. Start the Frontend (Flutter Web)
   // turbo
   Run command: `cd conekiller_client && flutter run -d chrome --web-renderer html --dart-define=USE_MOCK_REPO=true`
   *Note: Using Mock Repo for offline development.*

3. Verify Health
   // turbo
   Run command: `curl http://127.0.0.1:8000/health`
