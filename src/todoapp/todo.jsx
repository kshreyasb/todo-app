import { BrowserRouter } from "react-router-dom";
import "./todo.css";
import { useState, useEffect } from 'react';

const TaskItem = ({ task, onEdit, onDelete, onMoveClick }) => (
  <div className="d-flex flex-row mt-2 rounded-1 justify-content-between w-100 h-10 bg-light p-2">
    <div>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
    <div className="task-priority">
      <span className={`priority-dot priority-${task.priority}`}></span> {/* Priority Indicator */}
    </div>
    <div>
      <button className="btn btn-outline-warning btn-sm mx-1" onClick={() => onEdit(task)}>
        <i className="bi bi-pencil-fill"></i> Edit
      </button>
      <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(task.id)}>
        <i className="bi bi-trash-fill"></i> Delete
      </button>
      <button className="btn btn-outline-info btn-sm" onClick={() => onMoveClick(task)}>
        Move
      </button>
    </div>
  </div>
);

export function ToDoApp() {
  useEffect(() => {
    document.body.style.backgroundColor = "#f8f8f8"; // Match the neutral background from the image
  }, []);

  const [visibleDiv, setVisibleDiv] = useState(1); // Handle active tab
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [priority, setPriority] = useState('low'); // New state for task priority
  const [editingTask, setEditingTask] = useState(null); // State to handle editing
  const [taskToMove, setTaskToMove] = useState(null); // State to handle task moving

  // Function to generate a unique ID for each task
  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  // Add or Edit Task
  const handleAddOrEditTodo = () => {
    if (editingTask) {
      // Edit Task
      setTodos(prevTodos =>
        prevTodos.map(task =>
          task.id === editingTask.id
            ? { ...task, title: newTitle, description: newDescription, priority }
            : task
        )
      );
      setEditingTask(null); // Clear the editing state
    } else {
      // Add New Task
      let newTodoItem = {
        id: generateId(),
        title: newTitle,
        description: newDescription,
        priority: priority,
        status: "today" // Default status for new tasks
      };
      setTodos(prevTodos => [...prevTodos, newTodoItem]);
    }

    // Clear fields after adding or editing
    setNewTitle('');
    setNewDescription('');
    setPriority('low');
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    setTodos(prevTodos => prevTodos.filter(task => task.id !== taskId));
  };

  // Open the move modal
  const handleMoveClick = (task) => {
    setTaskToMove(task); // Set the task to be moved
  };

  // Move Task to the selected status
  const handleMoveTask = (status) => {
    setTodos(prevTodos =>
      prevTodos.map(task =>
        task.id === taskToMove.id
          ? {
              ...task,
              status: status // Update the task status
            }
          : task
      )
    );
    setTaskToMove(null); // Clear the task to move after it has been moved
  };

  // Edit Task
  const handleEditTask = (task) => {
    setNewTitle(task.title);
    setNewDescription(task.description);
    setPriority(task.priority);
    setEditingTask(task); // Set the task being edited
  };

  return (
    <div className="todo-app-container">
      <BrowserRouter>
        <div>
          {/* Header */}
          <header className="d-flex justify-content-between p-4 text-white">
            <div className="mx-auto">
                <span className="fs-1 fw-bold">To Do App</span>
            </div>
           </header>
            <br/>
          <div className="tab-selector mx-auto d-flex justify-content-around text-dark fs-5" style={{ maxWidth: '500px' }}>
            <button onClick={() => setVisibleDiv(1)} className={`btn ${visibleDiv === 1 ? 'btn-success' : 'btn-outline-success'} p-2 w-100`}>
              Today
            </button>
            <button onClick={() => setVisibleDiv(2)} className={`btn ${visibleDiv === 2 ? 'btn-success' : 'btn-outline-success'} p-2 w-100 mx-1`}>
              Pending
            </button>
            <button onClick={() => setVisibleDiv(3)} className={`btn ${visibleDiv === 3 ? 'btn-success' : 'btn-outline-success'} p-2 w-100`}>
              Overdue
            </button>
          </div>
            <br/>
          {/* Add/Edit Task Modal */}
          <div className="mx-auto d-flex justify-content-between" style={{maxWidth:'700px'}}> 
                    <div className="mx auto">
                        <span className="fs-2 fw-bold">Task</span>
                    </div>
            <div>
              <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addTask">
                <i className="bi bi-plus-circle"></i> {editingTask ? 'Edit Task' : 'Add Task'}
              </button>
            </div>

            <div className="modal fade" id="addTask">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">{editingTask ? 'Edit Task Details' : 'Task Details'}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <dl>
                      <dt>Title</dt>
                      <dd>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Give task title"
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                        />
                      </dd>
                      <dt>Comments</dt>
                      <dd>
                        <textarea
                          className="form-control"
                          placeholder="Add task details"
                          value={newDescription}
                          onChange={e => setNewDescription(e.target.value)}
                          style={{ height: '100px' }}
                        />
                      </dd>
                      <dt>Priority</dt>
                      <dd>
                        <select
                          className="form-control"
                          value={priority}
                          onChange={e => setPriority(e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </dd>
                    </dl>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-success" data-bs-dismiss="modal">Close</button>
                    <button type="button" onClick={handleAddOrEditTodo} className="btn btn-success">
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Move Task Modal */}
          {taskToMove && (
            <div className="modal fade show d-block" id="moveTaskModal" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Move Task</h5>
                    <button type="button" className="btn-close" onClick={() => setTaskToMove(null)} aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>Where would you like to move this task?</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-primary" onClick={() => handleMoveTask('pending')}>
                      Move to Pending
                    </button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => handleMoveTask('overdue')}>
                      Move to Overdue
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setTaskToMove(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task Display */}
          <section className="task-section mx-auto d-flex flex-column" style={{ maxWidth: '700px' }}>
            {visibleDiv === 1 && (
              <div>
                {allTodos
                  .filter(task => task.status === 'today')
                  .map(task => (
                    <TaskItem key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} onMoveClick={handleMoveClick} />
                  ))}
              </div>
            )}
            {visibleDiv === 2 && (
              <div>
                {allTodos
                  .filter(task => task.status === 'pending')
                  .map(task => (
                    <TaskItem key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} onMoveClick={handleMoveClick} />
                  ))}
              </div>
            )}
            {visibleDiv === 3 && (
              <div>
                {allTodos
                  .filter(task => task.status === 'overdue')
                  .map(task => (
                    <TaskItem key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} onMoveClick={handleMoveClick} />
                  ))}
              </div>
            )}
          </section>
        </div>
      </BrowserRouter>
    </div>
  );
}
