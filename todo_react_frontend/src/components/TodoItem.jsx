import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TodoItem - Single todo row with inline editing.
 * Props:
 * - todo: { id, title, completed, priority, dueDate }
 * - onToggle(id)
 * - onUpdate(id, updates)
 * - onDelete(id)
 */
function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const commitEdit = () => {
    const val = draft.trim();
    if (!val) {
      // empty title deletes or revert? choose revert to prior
      setDraft(todo.title);
      setIsEditing(false);
      return;
    }
    if (val !== todo.title) onUpdate(todo.id, { title: val });
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setDraft(todo.title);
      setIsEditing(false);
    }
  };

  const overdue = (() => {
    if (!todo.dueDate) return false;
    try {
      const today = new Date();
      const due = new Date(todo.dueDate);
      // Compare dates ignoring time
      const todayYMD = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dueYMD = new Date(due.getFullYear(), due.getMonth(), due.getDate());
      return dueYMD < todayYMD && !todo.completed;
    } catch {
      return false;
    }
  })();

  return (
    <div className="todo-item" aria-label={`Todo: ${todo.title}`}>
      <input
        className="checkbox"
        type="checkbox"
        checked={!!todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
      />

      <div className="todo-title">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={onKeyDown}
            aria-label="Edit title"
          />
        ) : (
          <button
            className="linklike"
            onClick={() => setIsEditing(true)}
            title="Click to edit title"
            aria-label="Edit todo title"
            style={{
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: todo.completed ? '#6b7280' : 'inherit',
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'text'
            }}
          >
            {todo.title}
          </button>
        )}
        <div className="todo-meta" aria-label="Todo metadata">
          <span
            aria-label={`Priority: ${todo.priority}`}
            className={
              todo.priority === 'high'
                ? 'priority-high'
                : todo.priority === 'low'
                ? 'priority-low'
                : 'priority-medium'
            }
          >
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          {todo.dueDate && (
            <span
              className={`due-badge ${overdue ? 'overdue' : ''}`}
              aria-label={`Due ${todo.dueDate}${overdue ? ' overdue' : ''}`}
              title={overdue ? 'Overdue' : 'Due date'}
            >
              Due {todo.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="item-actions" aria-label="Item actions">
        <button
          className="btn btn-secondary"
          onClick={() =>
            onUpdate(todo.id, {
              priority:
                todo.priority === 'low'
                  ? 'medium'
                  : todo.priority === 'medium'
                  ? 'high'
                  : 'low',
            })
          }
          aria-label="Cycle priority"
          title="Cycle priority"
        >
          Priority
        </button>
        <button
          className="btn btn-danger-outline"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
