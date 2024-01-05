import "./App.css";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { LuCheck } from "react-icons/lu";

function App() {
  const [todo, setToDo] = useState("");
  const [desc, setNewDesc] = useState("");
  const [editToDo, setEditToDo] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [compTasks, setCompTasks] = useState([]);
  const [compScr, setCompScr] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [enabledIndex, setEnabledIndex] = useState(null);

  // Add Tasks
  const handleAddItem = () => {
    let newTodoItem = {
      title: todo,
      description: desc,
    };

    if (todo !== "" && desc !== "") {
      let updatedTodoArr = [...allTodos];
      updatedTodoArr.push(newTodoItem);
      setTodos(updatedTodoArr);
      localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
      setToDo("");
      setNewDesc("");
    } else {
      if (todo === "" && desc !== "") {
        alert("Please add Title to your task");
      } else if (todo !== "" && desc === "") {
        alert("Please add Description to your task");
      } else {
        alert("Please add Title and Description to your task");
      }
    }
  };

  // Delete Tasks
  const handleDeleteItem = (index) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      let removeTodo = [...allTodos];
      removeTodo.splice(index, 1);
      setTodos(removeTodo);
      localStorage.setItem("todolist", JSON.stringify(removeTodo));
    }
  };

  // Edit Tasks
  const handleInputEnabled = (index) => {
    setEnabledIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const isInputEnabled = (index) => enabledIndex === index;

  const handleEdit = (index) => {
    if (editToDo !== "" && editDesc !== "") {
      if (index !== null) {
        let updatedTodoArr = [...allTodos];
        updatedTodoArr[index] = {
          title: editToDo,
          description: editDesc,
        };
        setTodos(updatedTodoArr);
        localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
        setEditToDo("");
        setEditDesc("");
        handleInputEnabled(index);
      }
    } else {
      alert("Please finish editing!");
    }
  };

  //Delete Completed Tasks
  const handleDeleteCompleted = (index) => {
    var result = window.confirm('Are you want to clear the completed tasks?');
    if (result === true){
      let removeCompleted = [...compTasks];
      removeCompleted.splice(index, 1);
      setCompTasks(removeCompleted);
      localStorage.setItem("completeTask", JSON.stringify(removeCompleted));
    }
  };

  //Delete all completed tasks
  const handleClearCompletedTasks = () => {
    var result = window.confirm('Are you want to clear the completed tasks?');
      if (result === true){
        setCompTasks([]);
        localStorage.removeItem("completeTask");
    };
  };

  //Mark tasks as completed
  const handleCompleted = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    let completedOn = `${mm}-${dd}-${yyyy} at ${h}:${m}:${s}`;

    if (window.confirm("Are you sure you want to mark this as completed?")) {
      let filteredItem = {
        ...allTodos[index],
        completedOn: completedOn,
      };

      let updatedCompletedArr = [...compTasks];
      updatedCompletedArr.push(filteredItem);
      setCompTasks(updatedCompletedArr);
      let removeTodo = [...allTodos];
      removeTodo.splice(index, 1);
      setTodos(removeTodo);
      localStorage.setItem("todolist", JSON.stringify(removeTodo));
      localStorage.setItem("completeTask", JSON.stringify(updatedCompletedArr));
    }
  };

  //fetch saved tasks and completed tasks from localStorage
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompleted = JSON.parse(localStorage.getItem("completeTask"));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompleted) {
      setCompTasks(savedCompleted);
    }
  }, []);

  
  //rendering part
  return (
    <div className="ToDoApp">
      <div className="todo-wrapper">
        <div className="todo-input">
          <h1>what do u want me to do?</h1>
          <div className="todo-input-item">
            <label>To Do: </label>
            <input
              type="text"
              value={todo}
              onChange={(e) => setToDo(e.target.value)}
              placeholder="What is your task?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description of the task: </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Can you describe it?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddItem}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="btn-area">
          <button
            className={`secondaryBtn ${compScr === false && "active"}`}
            onClick={() => setCompScr(false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${compScr === true && "active"}`}
            onClick={() => setCompScr(true)}
          >
            Completed
          </button>
            <div className="clrBtn">
              <button
                  className={`clearAll ${compScr === true && "show"}`}
                  onClick={handleClearCompletedTasks}
                >
                  Clear Completed{" "}
                </button> 
            </div>
            
        </div>

        <div className="todo-list">
          {compScr === false &&
            allTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    {isInputEnabled(index) ? (
                      <>
                        <input
                          type="text"
                          value={editToDo}
                          onChange={(e) => setEditToDo(e.target.value)}
                          disabled={isInputEnabled}
                          placeholder="Edit Task"
                        />
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          disabled={isInputEnabled}
                          placeholder="Set New Description"
                        />
                      </>
                    ) : (
                      <>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </>
                    )}
                  </div>
                  <div className="icon-area">
                    {isInputEnabled(index) ? (
                      <>
                        <MdOutlineCancel
                          className="delete-icon"
                          onClick={() => handleInputEnabled(index)}
                        />
                        <LuCheck
                          className="check-icon"
                          onClick={() => handleEdit(index)}
                        />
                      </>
                    ) : (
                      <>
                        <AiOutlineDelete
                          className="delete-icon"
                          onClick={() => handleDeleteItem(index)}
                        />
                        <CiEdit
                          className="edit-icon"
                          onClick={() => handleInputEnabled(index)}
                        />
                        <LuCheck
                          className="check-icon"
                          onClick={() => handleCompleted(index)}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          {/* <div className="clrBtn">
            <button
                className={`clearAll ${compScr === true && "show"}`}
                onClick={handleClearCompletedTasks}
              >
                Clear Completed{" "}
              </button> 
          </div> */}

          {compScr === true &&
            compTasks.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>Completed On: {item.completedOn}</small>
                    </p>
                  </div>
                  <div className="icon-area">
                    <AiOutlineDelete
                      className="delete-icon"
                      onClick={() => handleDeleteCompleted(index)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
