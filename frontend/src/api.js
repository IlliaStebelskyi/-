const BASE = "http://localhost:5000/api";

const headers = () => ({
  "Content-Type": "application/json"
});

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

const parseError = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const errorBody = await response.json().catch(() => null);
    return errorBody?.message || errorBody?.title || "Request failed";
  }
  return response.statusText || "Request failed";
};

// Auth endpoints
export const login = (data) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  }).then(async (r) => {
    if (!r.ok) {
      const message = await parseError(r);
      throw new Error(message);
    }
    return r.json();
  });

export const register = (data) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  }).then(async (r) => {
    if (!r.ok) {
      const message = await parseError(r);
      throw new Error(message);
    }
    return r.json();
  });

// Tasks endpoints
export const getTasks = () =>
  fetch(`${BASE}/tasks`, { headers: authHeaders() }).then(r => {
    if (!r.ok) throw new Error("Failed to fetch tasks");
    return r.json();
  });

export const createTask = (task) =>
  fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(task)
  }).then(r => {
    if (!r.ok) throw new Error("Failed to create task");
    return r.json();
  });

export const updateTask = (id, task) =>
  fetch(`${BASE}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(task)
  }).then(r => {
    if (!r.ok) throw new Error("Failed to update task");
    return r.json();
  });

export const deleteTask = (id) =>
  fetch(`${BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  }).then(r => {
    if (!r.ok) throw new Error("Failed to delete task");
    return r.json();
  });

// Statistics endpoints
export const getStatistics = () =>
  fetch(`${BASE}/statistics`, { headers: authHeaders() }).then(r => {
    if (!r.ok) throw new Error("Failed to fetch statistics");
    return r.json();
  });

export const getCategories = () =>
  fetch(`${BASE}/statistics/categories`, { headers: authHeaders() }).then(r => {
    if (!r.ok) throw new Error("Failed to fetch categories");
    return r.json();
  });

// Export functions
export const exportTasksAsCSV = (tasks, filename = "tasks.csv") => {
  const headers = ["ID", "Title", "Description", "Category", "Priority", "Due Date", "Completed", "Created At"];
  const rows = tasks.map(task => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`,
    `"${(task.description || "").replace(/"/g, '""')}"`,
    task.category,
    task.priority,
    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
    task.isCompleted ? "Yes" : "No",
    new Date(task.createdAt).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTasksAsJSON = (tasks, filename = "tasks.json") => {
  const json = JSON.stringify(tasks, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};