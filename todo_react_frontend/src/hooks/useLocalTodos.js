import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'ocean_todos_v1';
const STORAGE_FILTER_KEY = 'ocean_todos_filter_v1';

function safeParse(json, fallback) {
  try {
    const val = JSON.parse(json);
    return Array.isArray(val) ? val : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * PUBLIC_INTERFACE
 * useLocalTodos - Manage todos with localStorage persistence and filtering.
 * Returns:
 * {
 *   todos, filteredTodos, filter,
 *   addTodo(title, {priority, dueDate}),
 *   toggleTodo(id),
 *   updateTodo(id, updates),
 *   deleteTodo(id),
 *   clearCompleted(),
 *   toggleAll(completed),
 *   setFilter(filter)
 * }
 */
export function useLocalTodos() {
  const initialTodos = useRef(null);
  const initialFilter = useRef(null);

  if (initialTodos.current === null) {
    const raw = localStorage.getItem(STORAGE_KEY);
    initialTodos.current = safeParse(raw, []);
  }
  if (initialFilter.current === null) {
    initialFilter.current = localStorage.getItem(STORAGE_FILTER_KEY) || 'all';
  }

  const [todos, setTodos] = useState(initialTodos.current);
  const [filter, setFilter] = useState(initialFilter.current);

  // Persist to storage when todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore storage errors (quota, etc.)
    }
  }, [todos]);

  // Persist filter
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FILTER_KEY, filter);
    } catch {}
  }, [filter]);

  const addTodo = useCallback((title, { priority = 'medium', dueDate } = {}) => {
    const next = {
      id: uid(),
      title: String(title),
      completed: false,
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      dueDate: dueDate || undefined,
      createdAt: Date.now(),
    };
    setTodos(prev => [next, ...prev]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const toggleAll = useCallback((completed) => {
    setTodos(prev => prev.map(t => ({ ...t, completed: !!completed })));
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  return {
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
  };
}
