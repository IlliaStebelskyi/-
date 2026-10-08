import { exportTasksAsCSV, exportTasksAsJSON } from "../api";

export default function ExportPanel({ tasks, onClose }) {
  return (
    <div className="form-section">
      <h3>Export Tasks</h3>

      <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            exportTasksAsCSV(tasks);
            onClose?.();
          }}
        >
          Export as CSV
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            exportTasksAsJSON(tasks);
            onClose?.();
          }}
        >
          Export as JSON
        </button>
      </div>
    </div>
  );
}
