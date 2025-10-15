# Ocean Tasks - React To-do App

A modern, single-column to-do application with Ocean Professional styling. State persists in localStorage. Built with pure React and vanilla CSS.

## Features

- Add, view, inline edit, complete/uncomplete, and delete todos
- Filters: All, Active, Completed with dynamic counts
- Bulk actions: toggle all (complete/uncomplete), clear completed, and optional Clear All (with confirm)
- Each todo includes priority (Low/Med/High) and optional due date, with overdue highlighting
- LocalStorage persistence across reloads
- Accessible semantic HTML, ARIA labels, and keyboard-friendly controls
- Responsive single-column layout with soft gradient header, subtle shadows, rounded corners, and smooth transitions
- Organized code: components, a `useLocalTodos` hook, and an `api.js` scaffold for future backend integration

## Getting Started

In the project directory, run:

```bash
npm start
```

Open http://localhost:3000 to view in the browser.

## Architecture

- src/hooks/useLocalTodos.js
  - Manages todo state, filtering, and persistence in localStorage.
  - PUBLIC_INTERFACE:
    - { todos, filteredTodos, filter, addTodo(title, {priority, dueDate}), toggleTodo(id), updateTodo(id, updates), deleteTodo(id), clearCompleted(), toggleAll(completed), setFilter(filter) }

- src/components/TodoInput.jsx
  - Input for new todo with title, priority, and optional due date.

- src/components/TodoList.jsx
  - Renders todos using TodoItem.

- src/components/TodoItem.jsx
  - Row with checkbox, inline title editing, priority cycle, due date, and delete.

- src/services/api.js
  - Promise-based stubs for future backend.

## Styling

Ocean Professional palette:
- Primary #2563EB, Success/Secondary #F59E0B, Error #EF4444
- Background #f9fafb, Surface #ffffff, Text #111827
- Soft gradient header and subtle shadows.

## Notes

- No external services required; everything runs locally.
- To clear all todos, use the "Clear all" button (with confirmation).
