'use strict';

const STORAGE_KEY = 'todos-js-demo'
const todoStorage = {
  uid: 0,
  fetch: () => {
    const todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todoStorage.uid = todos[todos.length - 1].id
    return todos
  },
  save: (todos) =>  {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

let todos = [];
const todoInput = document.getElementById('todo_input');
const todoInputForm = document.querySelector('form');
const tableBody = document.querySelector('tbody');
const filterRadioButtons = document.querySelectorAll(`input[type='radio'][name='filter']`);

const toggleCheckIsDone = (e) => {
  // 設定したidをe.currentTarget.idで取得してデータのindexを検索する。
  // e.currentTarget.idは文字列なので、todo.idと同じ数値に直してから比較する。
  const targetIndex = todos.findIndex((todo) => todo.id === Number(e.currentTarget.id))
  todos[targetIndex].isDone = e.currentTarget.checked;

  // ローカルストレージに保存
  todoStorage.save(todos)
}

const removeTodo = (e) => {
  // 設定したidをe.currentTarget.idで取得してデータのindexを検索する。
  // e.currentTarget.idは文字列なので、todo.idと同じ数値に直してから比較する。
  const targetIndex = todos.findIndex((todo) => todo.id === Number(e.currentTarget.id))
  const targetTr = tableBody.children[targetIndex]
  targetTr.remove()

  // todosからも削除
  todos.splice(targetIndex, 1)  
  // ローカルストレージに保存
  todoStorage.save(todos)
}

const addTodoItemToTable = (todoItem) => {
    const tr = document.createElement('tr');
    for (const prop in todoItem) {
      const td = document.createElement('td');
      if(prop === 'isDone') {
        // プロパティがisDoneのときはチェックボックスを追加する。
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todoItem[prop];
        // toggleCheckIsDoneで検索しやすいようにチェックボックスにidを設定する
        checkbox.id = todoItem.id
        checkbox.addEventListener('change', toggleCheckIsDone)
        td.classList.add('done')
        td.appendChild(checkbox);
        tr.appendChild(td);
      } else {
        td.textContent = todoItem[prop];
        td.classList.add(prop)
        tr.appendChild(td);
      }
    }
    // 削除ボタンを追加する
    const tdForDeleteButton = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除'
    // removeTodoで検索しやすいように削除ボタンにidを設定する
    deleteButton.id = todoItem.id
	  deleteButton.addEventListener('click', removeTodo)
    tdForDeleteButton.classList.add('button')
    tdForDeleteButton.appendChild(deleteButton)
    tr.appendChild(tdForDeleteButton);

    tableBody.append(tr);
}

// 表の中身をすべて消す
const clearTable = () => {
  const trList = Array.from(tableBody.children)
  trList.forEach((tr) => tr.remove())
}

const filterTodos = (e) => {
  if(e.target.value === 'all') {
    clearTable()

    // フィルター対象のtodoを表に表示する
    todos.forEach((todo) => {
      addTodoItemToTable(todo)
    })
  }
  if(e.target.value === 'isNotDone') {
    clearTable()

    // フィルター対象のtodoを表に表示する
    const isNotDoneTodos = todos.filter((todo) => todo.isDone === false) 
    isNotDoneTodos.forEach((todo) => {
      addTodoItemToTable(todo)
    })
  }
  if(e.target.value === 'isDone') {
    clearTable()

    // フィルター対象のtodoを表に表示する
    const isDoneTodos = todos.filter((todo) => todo.isDone === true) 
    isDoneTodos.forEach((todo) => {
      addTodoItemToTable(todo)
    })
  }
}

// 最初の HTML 文書の読み込みと解析が完了したとき、スタイルシート、画像、サブフレームの読み込みが完了するのを待たずに発生
document.addEventListener('DOMContentLoaded', () => {
  const todosInStorage = todoStorage.fetch()

  // localStorageのデータを表に表示
  todosInStorage.forEach((todo) => {
    addTodoItemToTable(todo)
  })

  // todosにも追加
  todos = todosInStorage
});

const addTodo = (event) => {
  // submitイベントではフォームがリロードされるので、リロードさせないようにする
  event.preventDefault()

  // 新しいTODOの入力値を参照
  const content = todoInput.value
  // 入力がなければ先の処理に進まないように
  if (!content.length) {
    return
  }

  const todoInputItem = {}; // 入力値を一時的に格納するオブジェクト
  todoInputItem.isDone = false // 初期値はfalseにする
  todoInputItem.id = todoStorage.uid++
  todoInputItem.content = content

  // tableタグ内のtbodyの中にtodoInputItemの要素を追加する
  addTodoItemToTable(todoInputItem)

  // todoInputItemを現在のtodosへ追加
  todos.push(todoInputItem)
  
  // 新しいTODOの入力欄を空にする
  todoInput.value = ''

  // ローカルストレージに保存
  todoStorage.save(todos)
}

todoInputForm.addEventListener('submit', addTodo)

filterRadioButtons.forEach((radioButton) =>  {
  radioButton.addEventListener('change', filterTodos)
})