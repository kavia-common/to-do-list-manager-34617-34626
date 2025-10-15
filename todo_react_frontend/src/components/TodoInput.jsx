import React, { useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TodoInput - Input row for creating a new todo with title, priority, and optional due date.
 * Props:
 * - onAdd: function(title: string, options: {priority: 'low'|'medium'|'high', dueDate?: string})
 */
function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef(null);

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, { priority, dueDate: dueDate || undefined });
    setTitle('');
    setPriority('medium');
    setDueDate('');
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <div className="input-row" role="form" aria-label="Add new todo">
      <label className="visually-hidden" htmlFor="todo-title">Title</label>
      <input
        id="todo-title"
        ref={inputRef}
        type="text"
        className="text-input full"
        placeholder="What needs to be done?"
        aria-label="Todo title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <label className="visually-hidden" htmlFor="todo-priority">Priority</label>
      <select
        id="todo-priority"
        className="select"
        aria-label="Priority"
        value={priority}
        onChange={e => setPriority(e.target.value)}
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      <label className="visually-hidden" htmlFor="todo-due">Due date</label>
      <input
        id="todo-due"
        className="date-input"
        type="date"
        aria-label="Due date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <button
        type="button"
        className="btn btn-primary"
        onClick={submit}
        aria-label="Add todo"
        title="Add todo"
      >
        Add
      </button>
    </div>
  );
}

// Hidden label utility for accessibility
const style = document.createElement('style');
style.innerHTML = `.visually-hidden{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;}`;
document.head.appendChild(style);

export default TodoInput;
