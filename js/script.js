'use strict';

const table = document.querySelector('table');
const todoInput = document.getElementById('todo_input');
const priority = document.querySelector('select');
const deadline = document.querySelector('input[type="date"]');
const submitButton = document.getElementById('submit');
const priorityFilterButton = document.getElementById('priority');
const removeDoneButtton = document.getElementById('remove');
let todoList = [];

const toggleCheckIsDone = (e) => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  const targetTr = e.currentTarget.parentElement.parentElement;
  const targetIndex = trList.indexOf(targetTr) - 1;
  todoList[targetIndex].isDone = e.currentTarget.checked;
  localStorage.setItem('todoList', JSON.stringify(todoList))
}

const addTodoItemToTable = (todoItem) => {
  const tr = document.createElement('tr');
  for (const prop in todoItem) {
    const td = document.createElement('td');
    if(prop === 'isDone') {
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = todoItem[prop];
      checkbox.addEventListener('change', toggleCheckIsDone)
      td.appendChild(checkbox);
      tr.appendChild(td);
    } else {
      td.textContent = todoItem[prop];
      tr.appendChild(td);
    }
  }
  table.append(tr);
};

// tableのヘッダー以外の要素削除
const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

// 最初の HTML 文書の読み込みと解析が完了したとき、スタイルシート、画像、サブフレームの読み込みが完了するのを待たずに発生
document.addEventListener('DOMContentLoaded', () => {
  const todoListInStorage = localStorage.getItem('todoList')
  if(!!todoListInStorage)
  todoList = JSON.parse(todoListInStorage)

  // localStorageのデータを表に表示
  todoList.forEach((todo) => {
    addTodoItemToTable(todo)
  })
});

// 登録ボタンの処理
submitButton.addEventListener('click', () => {
  // 入力値のバリデーション
  // if (todoInput.value === '') {
  //   alert('TODOを入力してください');
  //   return;
  // }
  // if (deadline.value === '') {
  //   alert('期日を入力してください');
  //   return;
  // }

  const todoInputItem = {};
  todoInputItem.todo = todoInput.value;
  todoInputItem.priority = priority.value;
  if (deadline.value != '') {
    todoInputItem.deadline = deadline.value;
  } else {
    // 期日が未入力の場合は今日の日付を入力
    const date = new Date();
    todoInputItem.deadline = date.toLocaleDateString().replace(/\//g, '-');
  }
  todoInputItem.isDone = false;

  // フォームをリセット
  todoInput.value = '';
  priority.value = '普';
  deadline.value = '';

  // inputの内容を表に表示
  addTodoItemToTable(todoInputItem)

  // localStorageに保存
  todoList.push(todoInputItem)
  localStorage.setItem('todoList', JSON.stringify(todoList))
});

// 優先度のフィルター処理
priorityFilterButton.addEventListener('click', () => {
  clearTable();
  for (const item of todoList) {
    if (item.priority == '高') {
      addTodoItemToTable(item);
    }
  }
})

// 完了したTODOを削除する処理
removeDoneButtton.addEventListener('click', () => {
  clearTable();
  todoList = todoList.filter((item) => item.isDone === false);
  for (const item of todoList) {
    addTodoItemToTable(item);
  }
  localStorage.setItem('todoList', JSON.stringify(todoList))
});