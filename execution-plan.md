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

### 3. Home page
[] Display a row of available movies, in each card include:
  - This data is available from `GET /api/movies`
  - Title
  - Description
  - viewCount
  - scoreAverage - This a rating between 0 and 5 use stars, round to halves like 3 stars or 3.5 stars
  - placeholder picture
[] Display a row of user views
  - This data is available from `GET /api/views`
  - Use the same card design as in the previous section

### 4. Rating movies
[] When a movie in the homepage is clickde a window to rate a movie with up top 5 stars should hover over the view
  - The rate section should show five large stars as input
  - The rate section should display title and description
  - The rate section should say "What do you think of this movie?"
  - The reate section should have an option to just "Mark as view" and submit with 0 stars.
[] If the clicked movie should be compared against existing reviews
  - If a review exists use `PATCH /api/views`
  - If a review doesn't exist use `POST /api/views`
[] Fetch `GET /api/movies/:id` to get updated movie data after it is reviewed and update the data in both your reviews and all movies.

### 5. Admin section
[] Create a new view under the path `/admin` with a more serious tone.
[] Link this view in the navbar
[] Link `go back to user mode` in navbar. Feel free to rephrase it.
[] These path is just a dashboard create buttons that redirect to
  - Manage movies `/admin/movies`
  - Manage genres `/admin/genres`
  - Manage staff members `/admin/staff`

### 6. Create CRUD for resources
Let's not worry about relationships for now let's create the following for each resource
[] `/` Table all records displaying
  - Display known properties
  - Edit option: redirects to `/:id/edit`
  - Delete option: ask for confirmation
  - View option: display a modal with the details of the record and link again edit or delete
  - Add a link to create new records
[] `/new` Form to create a new record of current resource
[] `/:id/edit` Form that loads existing data and let's you edit resrouce for a given id
[] Add `Go back` options in each view