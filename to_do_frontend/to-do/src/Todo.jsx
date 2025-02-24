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


  //Handle Delete

  const handleDelete=(id)=>{
if(window.confirm("Are you sure want to delete?")){
  fetch( apiUrl+'/todos/'+id,{
    method:"Delete",

  })
  .then(()=>{
   const updatedTodos=  todos.filter((item)=>item._id !==id)
   setTodos(updatedTodos)
  })
}

  }



  return (
    <>
      <div className='row p-3 bg-success text-light'>
        <h1>TO-Do App using MERN Stack</h1>
      </div>

      {/* Add Task Section */}
      <div>
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className='form-group d-flex gap-2'>
          <input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} className='form-control' type="text" />
          <input placeholder='Description' onChange={(e) => setDescription(e.target.value)} value={description} className='form-control' type="text" />
          <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}
      </div>

      {/* Task List */}
      <div className='row mt-3'>
        <h3 className='text-start`'>Tasks</h3>
        <div className='col-md-6'>
        <ul className='list-group'>
          {todos.map((item) => (
            <li key={item._id} className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
              <div className='d-flex flex-column'>
                {editId === item._id ? (
                  <div className='form-group d-flex gap-2'>
                    <input placeholder='Title' onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className='form-control' type="text" />
                    <input placeholder='Description' onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className='form-control' type="text" />
                  </div>
                ) : (
                  <>
                    <span className='fw-bold'>{item.title}</span>
                    <span>{item.description}</span>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className='d-flex gap-2'>
                {editId === item._id ? (
                  <button onClick={handleUpdate} className='btn btn-success'>Update</button>
                ) : (
                  <button onClick={() => { setEditId(item._id); setEditTitle(item.title); setEditDescription(item.description); }} className='btn btn-warning'>Edit</button>
                )}
                <button className='btn btn-danger' onClick={()=>handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </>
  );
}

export default Todo;
