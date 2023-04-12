import { Todo } from './Todo'

export const TodoList = ({ todos, toggleTodoCompleted }) => {
  return (
    <>
    {todos.map((todo) => <Todo todo={todo} toggleTodoCompleted={toggleTodoCompleted} key={todo.id} />)}
    </>
  );
}