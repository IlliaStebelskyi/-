import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title,
      description: "",
      isCompleted: false,
      priority: "Medium"
    });

    setTitle("");
  };

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button>Add</button>
    </form>
  );
}