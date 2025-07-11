import React, { useEffect, useState } from 'react';

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "http://localhost:3000";

  // Add Todo
  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]); 
          setMessage("Added Successfully ✅");
          setTitle(""); 
          setDescription("");

          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Unable to create Todo item ❌");
          setTimeout(() => setError(""), 3000);
        });
    }
  };

  // Fetch Items on Load
  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  // Handle Update
  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(`${apiUrl}/todos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => res.json())
        .then(() => {
          setTodos(todos.map((todo) =>
            todo._id === editId ? { ...todo, title: editTitle, description: editDescription } : todo
          ));
          setEditId(-1);
        })
        .catch(() => setError("Update failed ❌"));
    }
  };

  // Handle Delete
  const handleDelete=(id)=>{
    if(window.confirm("Are you sure you want to delete?")){
      fetch(apiUrl+'/todos/'+id, {
        method:"DELETE",
      })
      .then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id)
        setTodos(updatedTodos)
      })
    }
  }

  return (
    <>
      {/* Header */}
      <div
        className='text-center p-4 mb-4'
        style={{
          background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
          color: 'white',
          fontWeight: '700',
          fontSize: '2.8rem',
          letterSpacing: '2px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          borderRadius: '8px',
        }}
      >
        Your Daily Task Buddy
      </div>

      {/* Add Task Section */}
      <div
        className='p-4 mb-5 mx-auto shadow rounded'
        style={{ maxWidth: '600px', backgroundColor: '#f9faff' }}
      >
        <h3 className='mb-3' style={{ color: '#3a7bd5', fontWeight: '600' }}>
          Add New Task
        </h3>

        {message && (
          <p
            className="text-success text-center"
            style={{ fontWeight: '600', fontSize: '1.1rem' }}
          >
            {message}
          </p>
        )}

        <div className='d-flex gap-3 mb-3'>
          <input
            placeholder='Title'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className='form-control'
            type="text"
            style={{ boxShadow: '0 2px 6px rgba(58, 123, 213, 0.3)' }}
          />
          <input
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className='form-control'
            type="text"
            style={{ boxShadow: '0 2px 6px rgba(58, 123, 213, 0.3)' }}
          />
          <button
            className='btn btn-primary'
            onClick={handleSubmit}
            style={{
              backgroundColor: '#00d2ff',
              borderColor: '#00d2ff',
              fontWeight: '700',
              boxShadow: '0 4px 8px rgba(0, 210, 255, 0.6)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0077b6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#00d2ff')}
          >
            Submit
          </button>
        </div>

        {error && (
          <p
            className='text-danger text-center'
            style={{ fontWeight: '600', fontSize: '1rem' }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Task List */}
      <div
        className='mx-auto shadow rounded p-4'
        style={{ maxWidth: '700px', backgroundColor: '#e6f7ff' }}
      >
        <h3
          className='mb-3'
          style={{ color: '#0077b6', fontWeight: '700', textAlign: 'left' }}
        >
          Your Tasks
        </h3>
        <ul className='list-group'>
          {todos.map((item) => (
            <li
              key={item._id}
              className='list-group-item d-flex justify-content-between align-items-center mb-3 rounded'
              style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            >
              <div className='d-flex flex-column' style={{ maxWidth: '70%' }}>
                {editId === item._id ? (
                  <div className='d-flex gap-2'>
                    <input
                      placeholder='Title'
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      className='form-control'
                      type="text"
                      style={{ boxShadow: '0 2px 5px rgba(0, 119, 182, 0.3)' }}
                    />
                    <input
                      placeholder='Description'
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      className='form-control'
                      type="text"
                      style={{ boxShadow: '0 2px 5px rgba(0, 119, 182, 0.3)' }}
                    />
                  </div>
                ) : (
                  <>
                    <span
                      className='fw-bold'
                      style={{ fontSize: '1.2rem', color: '#023e8a' }}
                    >
                      {item.title}
                    </span>
                    <span style={{ color: '#03045e' }}>{item.description}</span>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className='d-flex gap-2'>
                {editId === item._id ? (
                  <button
                    onClick={handleUpdate}
                    className='btn btn-success'
                    style={{
                      fontWeight: '700',
                      boxShadow: '0 3px 6px rgba(40, 167, 69, 0.5)',
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(item._id);
                      setEditTitle(item.title);
                      setEditDescription(item.description);
                    }}
                    className='btn btn-warning'
                    style={{
                      fontWeight: '700',
                      boxShadow: '0 3px 6px rgba(255, 193, 7, 0.5)',
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className='btn btn-danger'
                  onClick={() => handleDelete(item._id)}
                  style={{
                    fontWeight: '700',
                    boxShadow: '0 3px 6px rgba(220, 53, 69, 0.6)',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Todo;
