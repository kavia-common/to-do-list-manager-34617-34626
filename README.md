# Ocean Tasks – To-do List Manager

## Overview and Features
Ocean Tasks is a modern, single-column to-do application built with React and styled using the Ocean Professional theme. The current application is intentionally localStorage-first: all state is persisted in the browser without any external services or environment variables. This keeps the app simple to run locally and easy to extend later.

Key features include adding, viewing, inline editing, completing/uncompleting, and deleting todos. The app provides filters for All, Active, and Completed with dynamic counts. Bulk actions include toggling all items to completed/uncompleted, clearing completed items, and clearing all with confirmation. Each todo supports priority (Low, Medium, High) and an optional due date with overdue highlighting. The UI is accessible, keyboard-friendly, responsive, and includes subtle gradients, rounded corners, and soft shadows.

To run the frontend:
- Navigate to to-do-list-manager-34617-34626/todo_react_frontend
- Install dependencies and start the dev server:
  - npm install
  - npm start
- Open http://localhost:3000

No backend or environment variables are required for the current version.

## Architecture
The project is organized as a React app with a dedicated hook that encapsulates state and a small group of UI components.

- src/hooks/useLocalTodos.js
  - Owns all todo state, persistence, filtering, and bulk actions. It persists state to localStorage under the keys ocean_todos_v1 and ocean_todos_filter_v1. The hook exposes a stable PUBLIC_INTERFACE with methods to add, toggle, update, delete, clearCompleted, toggleAll, and setFilter.

- src/components/TodoInput.jsx
  - Input row to create todos with a title, priority, and optional due date.

- src/components/TodoList.jsx
  - Lists todos and composes TodoItem.

- src/components/TodoItem.jsx
  - Renders a row with a checkbox, inline title editing, priority cycling button, due date badge, and delete button. Highlights overdue items.

- src/services/api.js
  - A Promise-based scaffold intended for future backend integration. It exposes methods like listTodos, createTodo, updateTodo, deleteTodo, toggleAll, and clearCompleted. Currently these are no-ops returning mock-shaped values to document the expected contract.

- src/App.js and styling in src/App.css and src/index.css
  - Compose the layout, filters, counts, bulk actions, and render the list and input. App.css and index.css implement the Ocean Professional palette and UI tokens.

## Data Persistence Strategy (LocalStorage-first)
The app prioritizes a zero-config experience by persisting data locally in the browser. The custom hook useLocalTodos reads initial state from localStorage and writes updates after any changes. The filter state is also persisted to localStorage so that the selected view (All, Active, Completed) is remembered between sessions.

This approach is ideal for quick experiments, offline-first demos, and environments where a backend is not yet available. It also allows seamless migration to a backend later because the main UI already calls into a stable interface that can be swapped for network-backed implementations.

## Optional Backend with SQLite (Future)
While the application currently has no backend, it is designed so you can introduce an optional API that persists todos to a SQLite database. In that model:
- A lightweight server (for example, Node/Express, Python/FastAPI, or another stack of your choice) would expose REST endpoints for CRUD and bulk operations.
- The database would be SQLite with a simple todos table to support the same fields used by the frontend: id, title, completed, priority, dueDate, createdAt.
- The frontend would be configured with a base URL for the API via an environment variable such as REACT_APP_API_BASE_URL, and the services/api.js module would issue HTTP requests instead of returning stubbed data.

This preserves the UI and component structure while allowing you to evolve persistence from localStorage to a persistent server database when needed.

## API Endpoints (Planned)
The following endpoints are recommended for the optional backend. These mirror the service signatures in src/services/api.js:

- GET /todos
  - Returns an array of todos.

- POST /todos
  - Body: { title, priority, dueDate }
  - Returns the created todo including id, completed=false, and createdAt.

- PATCH /todos/:id
  - Body: { title?, priority?, dueDate?, completed? }
  - Returns the updated todo.

- DELETE /todos/:id
  - Deletes the specified todo and returns a minimal acknowledgement.

- POST /todos/toggle-all
  - Body: { completed: boolean }
  - Marks all todos as completed or active.

- POST /todos/clear-completed
  - Clears all completed todos.

These endpoints provide complete parity with the current local features so the UI behavior remains unchanged.

## Schema (Planned)
A minimal todos table in SQLite would look like:

- id: TEXT PRIMARY KEY (frontend currently uses a timestamp-random composite string)
- title: TEXT NOT NULL
- completed: INTEGER NOT NULL DEFAULT 0 (0=false, 1=true)
- priority: TEXT NOT NULL CHECK(priority IN ('low','medium','high')) DEFAULT 'medium'
- dueDate: TEXT NULL (stored as ISO date string, e.g., '2025-01-31')
- createdAt: INTEGER NOT NULL (epoch milliseconds)

Example CREATE TABLE (illustrative):
```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  dueDate TEXT,
  createdAt INTEGER NOT NULL
);
```

## Environment Variables (Future)
Currently, no environment variables are required. When adding the optional backend, introduce the following variable for the frontend:

- REACT_APP_API_BASE_URL
  - Example: http://localhost:4000
  - Used by src/services/api.js to construct fetch URLs for the backend.

Note: By design, no environment variables are needed in the current localStorage-only mode.

## How to Switch to Backend Later
When you are ready to introduce a backend:

1) Implement the backend API
- Stand up an HTTP server of your choice exposing the endpoints listed above.
- Use the SQLite schema described above.
- Ensure CORS allows requests from http://localhost:3000 during local development.

2) Configure the frontend with a base URL
- In to-do-list-manager-34617-34626/todo_react_frontend, create a .env file or use your shell environment:
  - REACT_APP_API_BASE_URL=http://localhost:4000
- Restart the dev server after changing environment variables.

3) Update src/services/api.js to use HTTP
- Replace the current stubbed methods with real fetch calls to REACT_APP_API_BASE_URL.
- Keep the existing method signatures to avoid touching UI components. For example:
  - listTodos: GET /todos
  - createTodo: POST /todos
  - updateTodo: PATCH /todos/:id
  - deleteTodo: DELETE /todos/:id
  - toggleAll: POST /todos/toggle-all
  - clearCompleted: POST /todos/clear-completed

4) Replace localStorage hook usage if desired
- Option A: Hybrid approach
  - Keep useLocalTodos for local state management but source/sync data via the api methods.
  - On app load, call api.listTodos() and seed local state.
  - On changes, call the corresponding api methods and then reconcile local state.

- Option B: API-centric state
  - Refactor useLocalTodos into useTodos that loads from the API on mount and updates state based on API responses.
  - Remove localStorage persistence once confidence in the backend is established.

5) Test and migrate data if needed
- Provide a one-time importer that reads from localStorage and writes todos to the backend (POST /todos for each). This is optional but can preserve existing user data during the transition.

## Styling and UX (Ocean Professional)
The UI adheres to the Ocean Professional theme:
- Primary #2563EB, Secondary/Success #F59E0B, Error #EF4444
- Background #f9fafb, Surface #ffffff, Text #111827
- Subtle gradient header, rounded corners, minimalistic layout, and smooth transitions

These tokens are implemented in src/App.css and src/index.css for consistent theming. The layout is a centered single-column card with an input row followed by the list. The UI emphasizes clarity, focus, and responsiveness.

## Development Notes
- Current persistence: localStorage only. No backend, database, or external services required.
- Current environment variables: none required.
- The services/api.js file exists purely as a scaffold to document the contract for future HTTP integration.
- The useLocalTodos hook contains the authoritative logic for state updates and filtering to make a future backend migration straightforward.
- Unit tests are not comprehensive; you may expand tests to cover the hook and component behavior, especially if introducing backend operations.

---
Sources:
- to-do-list-manager-34617-34626/todo_react_frontend/src/hooks/useLocalTodos.js
- to-do-list-manager-34617-34626/todo_react_frontend/src/services/api.js
- to-do-list-manager-34617-34626/todo_react_frontend/src/App.js
- to-do-list-manager-34617-34626/todo_react_frontend/src/App.css
- to-do-list-manager-34617-34626/todo_react_frontend/src/index.css
