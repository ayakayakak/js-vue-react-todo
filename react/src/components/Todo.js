export const Todo = ({ todo, toggleTodoCompleted }) => {
  return (
    <div>
      <label>
        <input type="checkbox" onChange={() => {toggleTodoCompleted(todo.id)}} checked={todo.isCompleted} />
        {todo.content}
      </label>
    </div>
  );
}