//
// PUBLIC_INTERFACE
// api.js - Future backend integration scaffold.
// For now, provides Promise-based no-op functions to illustrate shape.
//
/**
 * This module abstracts CRUD operations for todos. In a future iteration,
 * replace implementations with actual HTTP calls. Keep method signatures stable.
 */
export const api = {
  /** PUBLIC_INTERFACE: Fetch all todos (no-op; local handled elsewhere) */
  async listTodos() {
    return [];
  },
  /** PUBLIC_INTERFACE: Create a todo */
  async createTodo(todo) {
    return { ...todo };
  },
  /** PUBLIC_INTERFACE: Update a todo by id */
  async updateTodo(id, updates) {
    return { id, ...updates };
  },
  /** PUBLIC_INTERFACE: Delete a todo by id */
  async deleteTodo(id) {
    return { id };
  },
  /** PUBLIC_INTERFACE: Bulk toggle completion */
  async toggleAll(completed) {
    return { completed };
  },
  /** PUBLIC_INTERFACE: Clear completed todos */
  async clearCompleted() {
    return true;
  },
};
