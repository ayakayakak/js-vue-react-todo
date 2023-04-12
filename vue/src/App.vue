<script setup>
import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'todos-vuejs-demo'
const todoStorage = {
  uid: 0,
  fetch: () => {
    const todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach((todo, index) => {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: (todos) =>  {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const todos = ref([])
const newTodoInput = ref(null)

const filterOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'isNotDone',  label: '未完了' },
  { value: 'isDone',  label: '完了済み' },
]
// 選択している filterOptions の value を記憶するためのデータ。初期値を「すべて」にする
const currentFilter = ref('all')

// インスタンス作成時に自動的にlocalStorageの値を fetch() する
todos.value = todoStorage.fetch()

watch(todos, () => {
  todoStorage.save(todos.value)
}, { deep: true }) // deep オプションでネストしているデータも監視できる

const addTodo = () => {
  // テンプレート参照を使ってTODOの内容の入力値を参照
  const content = newTodoInput.value.value
  // 入力がなければ何もしないでreturn
  if (!content.length) {
    return
  }
  // { id, 内容, 完了状態 }というオブジェクトを現在の todos リストへ push
  todos.value.push({
    id: todoStorage.uid++,
    content: content,
    // 初期値はfalseで作成
    isDone: false
  })
  // TODOの内容の入力欄を空にする
  newTodoInput.value.value = ''
}

const removeTodo = (item) => {
  const targetIndex = todos.value.indexOf(item)
  todos.value.splice(targetIndex, 1)
}

const filterdTodos = computed(() => {
  if(currentFilter.value === 'all') return todos.value
  if(currentFilter.value === 'isDone') return todos.value.filter((todo) => todo.isDone === true)
  if(currentFilter.value === 'isNotDone') return todos.value.filter((todo) => todo.isDone === false)
})
</script>

<template>
  <div id="app">
    <h1>チュートリアルToDoリスト</h1>
    <label v-for="label in filterOptions" v-bind:key="label.value">
      <input type="radio" v-model="currentFilter" v-bind:value="label.value" />
      {{ label.label }}
    </label>
    <table>
      <!-- テーブルヘッダー -->
      <thead>
        <tr>
          <th class="done">完了</th>
          <th class="id">ID</th>
          <th class="content">内容</th>
          <th class="button">-</th>
        </tr>
      </thead>
      <tbody>
        <!-- [1] ここに <tr> で ToDo の要素を1行ずつ繰り返し表示したい -->
        <tr v-for="item in filterdTodos" v-bind:key="item.id">
          <th class="done"><input type="checkbox" v-model="item.isDone" /></th>
          <th class="id">{{ item.id }}</th>
          <td class="content">{{ item.content }}</td>
          <td class="button">
            <button v-on:click="removeTodo(item)">削除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>新しいTODOの追加</h2>
    <form class="add-form" v-on:submit.prevent="addTodo">
      <!-- 内容入力フォーム -->
      内容 <input type="text" ref="newTodoInput">
      <!-- 追加ボタンのモック -->
      <button type="submit">追加</button>
    </form>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
#app {
  max-width: 640px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  border-bottom: 2px solid #0099e4; /*#d31c4a */
  color: #0099e4;
}
th,
th {
  padding: 0 8px;
  line-height: 40px;
}
thead th.id {
  width: 50px;
}
thead th.done {
  width: 100px;
}
thead th.button {
  width: 60px;
}
tbody td.button, tbody td.done {
  text-align: center;
}
tbody tr td,
tbody tr th {
  border-bottom: 1px solid #ccc;
  transition: all 0.4s;
}
tbody tr.done td,
tbody tr.done th {
  background: #f8f8f8;
  color: #bbb;
}
tbody tr:hover td,
tbody tr:hover th {
  background: #f4fbff;
}
button {
  border: none;
  border-radius: 20px;
  line-height: 24px;
  padding: 0 8px;
  background: #0099e4;
  color: #fff;
  cursor: pointer;
}
</style>
