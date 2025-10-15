import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useLocalTodos } from './hooks/useLocalTodos';

/**
 * App - Main entry for the Todo application.
 * - Provides Ocean Professional styled layout.
 * - Hosts filters, counts, bulk actions, and renders input + list.
 */
function App() {
  const {
    todos,
    filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    toggleAll,
    setFilter,
  } = useLocalTodos();

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const counts = useMemo(() => {
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.length - active;
    return { total: todos.length, active, completed };
  }, [todos]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAdd = (title, { priority, dueDate }) => {
    addTodo(title, { priority, dueDate });
  };

  const handleClearAll = () => {
    const ok = window.confirm('Clear ALL todos? This cannot be undone.');
    if (ok) {
      // Reuse toggleAll + clearCompleted pattern: mark all completed and clear
      toggleAll(true);
      clearCompleted();
    }
  };

  return (
    <div className="ocean-app">
      <header className="ocean-header" role="banner" aria-label="Application header">
        <div className="header-inner">
          <h1 className="app-title">Ocean Tasks</h1>
          <p className="app-subtitle">Focus, plan, and accomplish</p>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="ocean-main" role="main">
        <section className="todo-card" aria-label="To-do manager">
          <TodoInput onAdd={handleAdd} />

          <div className="toolbar" role="region" aria-label="Filters and bulk actions">
            <div className="filters" role="tablist" aria-label="Todo filters">
              <button
                role="tab"
                aria-selected={filter === 'all'}
                className={`chip ${filter === 'all' ? 'chip-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({counts.total})
              </button>
              <button
                role="tab"
                aria-selected={filter === 'active'}
                className={`chip ${filter === 'active' ? 'chip-active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({counts.active})
              </button>
              <button
                role="tab"
                aria-selected={filter === 'completed'}
                className={`chip ${filter === 'completed' ? 'chip-active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({counts.completed})
              </button>
            </div>

            <div className="bulk-actions">
              <button
                className="btn btn-secondary"
                onClick={() => toggleAll(true)}
                aria-label="Mark all todos as completed"
              >
                Complete all
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => toggleAll(false)}
                aria-label="Mark all todos as active"
              >
                Uncomplete all
              </button>
              <button
                className="btn btn-amber"
                onClick={clearCompleted}
                aria-label="Clear all completed todos"
                disabled={counts.completed === 0}
              >
                Clear completed
              </button>
              <button
                className="btn btn-danger-outline"
                onClick={handleClearAll}
                aria-label="Clear all todos with confirmation"
                disabled={counts.total === 0}
              >
                Clear all
              </button>
            </div>
          </div>

          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </section>
      </main>

      <footer className="ocean-footer" role="contentinfo">
        <small>
          {counts.active} active / {counts.completed} completed — {counts.total} total
        </small>
      </footer>
    </div>
  );
}

export default App;
