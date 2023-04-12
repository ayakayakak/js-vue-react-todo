import { useState, useRef } from 'react'
import { TodoList } from './components/TodoList'
import { v4 as uuid } from 'uuid'

function App() {
  const [todos, setTodos] = useState([])
  const todoInputRef = useRef()

  const addTodo = () => {
    const newTodoContent = todoInputRef.current.value
    if(!newTodoContent) return
    setTodos([...todos, {
      id: uuid(),
      content: newTodoContent,
      isCompleted: false
    }])
    todoInputRef.current.value = null
  }
  
  const toggleTodoCompleted = (targetId) => {
    const newTodos = [...todos]
    const targetTodo = newTodos.find((todo) => todo.id === targetId)
    targetTodo.isCompleted = !targetTodo.isCompleted
    setTodos(newTodos)
  }

  const deleteCompletedTodos = () => {
    const newTodos = todos.filter((todo) => !todo.isCompleted)
    setTodos(newTodos)
  }

  return (
    <>
      <TodoList todos={todos} toggleTodoCompleted={toggleTodoCompleted} />
      <input type="text" ref={todoInputRef} />
      <button onClick={addTodo}>タスクを追加</button>
      <button onClick={deleteCompletedTodos}>完了したタスクの削除</button>
      <div>残りのタスク：{todos.filter((todo) => !todo.isCompleted).length}</div>
    </>
  );
}

export default App;
