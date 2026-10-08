export default function Dashboard({ statistics }) {
  if (!statistics) {
    return null;
  }

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-label">Total Tasks</div>
        <div className="stat-value">{statistics.total}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Completed</div>
        <div className="stat-value" style={{ color: "#059669" }}>
          {statistics.completed}
        </div>
        <div className="stat-trend">{statistics.completionRate}% done</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">In Progress</div>
        <div className="stat-value" style={{ color: "#d97706" }}>
          {statistics.pending}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">High Priority</div>
        <div className="stat-value" style={{ color: "#dc2626" }}>
          {statistics.highPriority}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Overdue</div>
        <div className="stat-value" style={{ color: "#dc2626" }}>
          {statistics.overdueTasks}
        </div>
      </div>
    </div>
  );
}
