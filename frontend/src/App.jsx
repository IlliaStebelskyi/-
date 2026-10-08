import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask, getStatistics, getCategories, exportTasksAsCSV, exportTasksAsJSON } from "./api";
import Login from "./Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("General");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [statistics, setStatistics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showExport, setShowExport] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData, categoriesData] = await Promise.all([
        getTasks(),
        getStatistics(),
        getCategories()
      ]);
      setTasks(tasksData);
      setStatistics(statsData);
      setCategories(categoriesData);
      setError("");
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleAddTask = async () => {
    try {
      if (!title.trim()) {
        setError("Title is required");
        return;
      }

      if (editingId) {
        await updateTask(editingId, { 
          title, 
          description, 
          priority, 
          dueDate,
          category,
          isCompleted: false 
        });
        setEditingId(null);
      } else {
        await createTask({ 
          title, 
          description, 
          priority, 
          dueDate,
          category,
          isCompleted: false 
        });
      }

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setCategory("General");
      setError("");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await loadData();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task.id, { 
        ...task, 
        isCompleted: !task.isCompleted 
      });
      await loadData();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    setCategory(task.category || "General");
    setEditingId(task.id);
    window.scrollTo(0, 0);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "completed" && !t.isCompleted) return false;
    if (filter === "pending" && t.isCompleted) return false;
    if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "duedate") {
      return (a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000)) - 
             (b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000));
    }
    return 0;
  });

  const allCategories = ["General", "Work", "Personal", "Shopping", "Health", ...categories];
  const uniqueCategories = [...new Set(allCategories)];

  if (!token) return <Login onLogin={setToken} />;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Task Manager</h1>
          <div className="header-actions">
            <span className="user-info">Logged in</span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Dashboard statistics={statistics} />

        {error && <div className="error-message" style={{ maxWidth: "1400px", margin: "0 auto 1.5rem" }}>{error}</div>}

        <div className="container">
          <aside className="sidebar">
            <div className="form-section">
              <h3>{editingId ? "Edit Task" : "Create Task"}</h3>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                onClick={handleAddTask}
                disabled={loading}
                className="btn btn-primary"
              >
                {editingId ? "Update Task" : "Add Task"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                    setPriority("Medium");
                    setDueDate("");
                    setCategory("General");
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>

            <button
              onClick={() => setShowExport(!showExport)}
              className="btn btn-secondary"
              style={{ marginTop: "1rem" }}
            >
              {showExport ? "Hide Export" : "Export Tasks"}
            </button>

            {showExport && (
              <div className="form-section" style={{ marginTop: "1rem" }}>
                <h3>Export Options</h3>
                <button
                  onClick={() => { exportTasksAsCSV(tasks); setShowExport(false); }}
                  className="btn btn-primary"
                >
                  Download CSV
                </button>
                <button
                  onClick={() => { exportTasksAsJSON(tasks); setShowExport(false); }}
                  className="btn btn-secondary"
                >
                  Download JSON
                </button>
              </div>
            )}
          </aside>

          <section className="main-content">
            <div className="toolbar">
              <div className="toolbar-controls">
                <div className="search-box">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="sort-box">
                  <label>Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-input"
                  >
                    <option value="date">Date Created</option>
                    <option value="duedate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                <div className="filter-box">
                  <label>Filter</label>
                  <div className="filter-group">
                    <button
                      onClick={() => setFilter("all")}
                      className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("pending")}
                      className={`filter-btn ${filter === "pending" ? "active" : ""}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilter("completed")}
                      className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : sortedTasks.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: "1.125rem", fontWeight: "500" }}>No tasks yet</p>
                <p className="text-muted">Create your first task to get started</p>
              </div>
            ) : (
              <div className="tasks-list">
                {sortedTasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${task.isCompleted ? "completed" : ""}`}
                  >
                    <div className="task-checkbox">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleComplete(task)}
                      />
                    </div>

                    <div className="task-content">
                      <h3 className="task-title">{task.title}</h3>
                      {task.description && <p className="task-description">{task.description}</p>}
                      <div className="task-meta">
                        <span className={`category category-${task.category?.toLowerCase()}`}>
                          {task.category}
                        </span>
                        <span className={`priority priority-${task.priority?.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className={`due-date ${new Date(task.dueDate) < new Date() && !task.isCompleted ? "overdue" : ""}`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className="created-date">
                          Created {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
