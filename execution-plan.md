## General context
`server/` is a node backend written with express
`frontend/` is a vite react+typescript template

The backend is complete and you may check any files under `server/bruno-collection/` or `server/src/routers/` as reference of the current API design.

`frontend/` dev server is configured to proxy `/api` to my running backend server on `http://localhost:3000`

API calls are created and handled in `frontend/src/api/streamify-client.ts` use it and modify it when needed.

The react project is using the following:
- react-router for routes.
- react-hook-form for forms.
- Tailwind as css library
- Shadcn as component/ui library

Make sure to continue using existing tooling.

ShadCN MCP server is enabled, I was manually working implementing ShadCN components. You may add more as you need using the shadcn mcp server.

## Execution plan

### 1. Create a login page
[] If the API client doesn't have an active session redirect to Login page.
  - Use `GET /api/auth/me` to validate if the current user has a valid session
  - Tokens are stored in localStorage although not good practice this is a sample project and need to keep some parts simple
[] If the user has an active session login or signup should not be accessible
[] User should be redirected to home page when session is active
[] The login page should greet the user and request email + password
[] The login page should offer a link to a sign up page (scaffold a sign up page with just hello world no content yet)
[] The login page url should be `/login`

### 2. Create a sign up page
[] The sign up page should greet the user
[] The sign up page should ask for name, last name, email and password
[] The login page redirects to `/login` on successful account creation