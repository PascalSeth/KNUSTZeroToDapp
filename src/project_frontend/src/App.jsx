import { useState, useEffect } from "react";
import { project_backend } from "declarations/project_backend";
import "./index.scss";

export default function App() {
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    updateTask();
  }, []);

  async function updateTask() {
    const response = await project_backend.viewTask();
    if (response.includes("📋 Task:")) {
      const titleMatch = response.match(/📋 Task: (.*)/);
      const descMatch = response.match(/📝 Description: (.*)/);
      const statusMatch = response.match(/📊 Status: (.*)/);

      setTask({
        title: titleMatch ? titleMatch[1] : "Untitled",
        description: descMatch ? descMatch[1] : "No description",
        isCompleted: statusMatch ? statusMatch[1].includes("✅") : false,
      });
    } else {
      setTask(null);
    }
  }

  async function handleAddTask() {
    setIsAdding(true);
    const response = await project_backend.addTask(title, description);
    setMessage(response);
    setIsAdding(false);
    updateTask();
  }

  async function handleCompleteTask() {
    setIsCompleting(true);
    const response = await project_backend.completeTask();
    setMessage(response);
    setIsCompleting(false);
    updateTask();
  }

  return (
    <div className="container">
      <div className="card">
        <h1>📋 Task Manager</h1>
        {task ? (
          <div className="task-card">
            <h2>Title: {task.title}</h2>
            <p>Description: {task.description}</p>
            <p className={task.isCompleted ? "completed" : "pending"}>
              Status: {task.isCompleted ? "✅ Completed" : "⏳ Pending"}
            </p>
          </div>
        ) : (
          <p className="no-task">No task available.</p>
        )}
        <div className="form-group">
          <input 
            placeholder="Task Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            disabled={task && !task.isCompleted}
          />
          <input 
            placeholder="Task Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            disabled={task && !task.isCompleted}
          />
          <button 
            className="add-button" 
            onClick={handleAddTask} 
            disabled={(task && !task.isCompleted) || isAdding}
          >
            {isAdding ? "Adding..." : "Add Task"}
          </button>
          {task && !task.isCompleted && (
            <button 
              className="complete-button" 
              onClick={handleCompleteTask} 
              disabled={task.isCompleted || isCompleting}
            >
              {isCompleting ? "Completing..." : "Complete Task"}
            </button>
          )}
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
