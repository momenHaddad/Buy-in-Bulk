# Buy in Bulk

A group-purchasing application with a React frontend and an Express/MongoDB API.

## Requirements

- Node.js 18 or newer
- MongoDB, local or hosted

## Local setup

1. Install backend dependencies: `cd backend && npm install`.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and a unique, randomly generated `JWT_SECRET`.
3. Start the API from `backend/` with `npm run dev`. The default port is `7001`.
4. Install frontend dependencies: `cd frontend && npm install`.
5. Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:7001/api`.
6. Start the frontend from `frontend/` with `npm start`.

The frontend is available at `http://localhost:3000` by default. Set `REACT_APP_API_URL` to the full API base URL, including `/api`, for another environment. Set `CORS_ORIGIN` in the backend to the frontend origin; multiple origins may be comma-separated.

## First administrator

Public registration always creates a regular user. After registering, promote the intended administrator account directly in MongoDB using a trusted database client. Do not add a public admin-registration route or publish database credentials.

## Security and deployment

- Never commit `.env` files, real credentials, uploaded runtime files, or private customer data.
- Rotate any credentials that have ever been committed or shared.
- Product browsing is public. Product changes and notification creation require an administrator account. Order and notification access requires authentication; users can only view their own orders.
- Configure HTTPS, production CORS origins, database network access, backups, and secret values in the deployment platform before exposing the service.
- User-uploaded images are stored locally by default. Use durable/private object storage for production; local filesystem uploads may not persist on many hosting platforms.

## Tests and builds

Run the frontend production build with `cd frontend && npm run build`. The backend does not currently have an automated test suite.