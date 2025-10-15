import React from 'react';
import TodoItem from './TodoItem';

/**
 * PUBLIC_INTERFACE
 * TodoList - Renders a list of todos.
 * Props:
 * - todos: Array<Todo>
 * - onToggle(id)
 * - onUpdate(id, updates)
 * - onDelete(id)
 */
function TodoList({ todos, onToggle, onUpdate, onDelete }) {
  if (!todos.length) {
    return (
      <div className="empty" role="note" aria-live="polite" style={{padding: '16px', color: '#6b7280'}}>
        No todos to show. Add a task above to get started.
      </div>
    );
  }

  return (
    <ul className="todo-list" role="list" aria-label="Todo items">
      {todos.map(todo => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
