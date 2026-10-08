export default function TaskCard({ task, onDelete }) {
  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}