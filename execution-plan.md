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
  - Add client side search by name
[] `/new` Form to create a new record of current resource
[] `/:id/edit` Form that loads existing data and let's you edit resrouce for a given id
[] Add `Go back` options in each view

### 7. Junction data management
[] In the edit view of the main resources add options to edit relationship data
[] Selecting this option should show a table with 2 columns:
  - Left side displays already related items
  - Right side displays items that can be added
  - Left column has option to remove
  - Right column has option to add
  - Add or remove options are somewhere in the ui and are only available when an option is selected
  - Each operation makes an api call to POST or DELETE the junction record
  - No new edits can be done while there is one in progress.

### 7.1 Movies and Genres example:
Left side shows genres already in movie with given id. Data from `GET /api/movies/:id/genres`
Right side shows genres not in movie with given id. Data from `GET /api/genres` get difference with genres already in movie.
Removing genres from left side `DELETE /api/movies/:id/genres` and refreshes right side.
Adding genres to movie `POST /api/movies/:id/genres

### 7.2 Movies and Staff_Members example:
Left side shows staff already in movie with given id. Data from `GET /api/movies/:id/staff`
Right side shows staff not in movie with given id. Data from `GET /api/staff` get set difference with staff already in movie.
This has a caveat Movie_Staff requires role name:
  - Display a field at the botton will display the role for existing Movie_Staff (data on left side)
  - Clicking on a staff member (right side) will display the role field empty and is required to add new record to movie.
Removing staff from left side `DELETE /api/movies/:id/staff` and refreshes right side.
Adding staff to movie `POST /api/movies/:id/staff`

### 7.3 Genres and Movies
Exact same steps as 7.1 but from Genres perspective (within Genre edit view), I wan to be able to assign or unassign movies to a genre.
  - Left `GET /api/genres/:id/movies`
  - Right `GET /api/movies`.
  - Adding `POST /api/genres/:id/movies`
  - Removing `DELETE /api/genres/:id/movies`

### 7.4 Staff_Members and Movies
Exact same steps as 7.2 but from Staff_Member perspective (within Staff_Member edit view), I wan to be able to assign or unassign movies to a staff_member.
  - Left `GET /api/staff/:id/movies`
  - Right `GET /api/movies`.
  - Adding `POST /api/staff/:id/movies`
  - Removing `DELETE /api/staff/:id/movies`