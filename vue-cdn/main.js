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

Vue.createApp({
  // `setup` 関数は、Composition API 専用の特別なフックです。
  setup() {
    const todos = Vue.ref([])
    const todoContent = Vue.ref(null)

    const filterOptions = [
      { value: 'all', label: 'すべて' },
      { value: 'isNotDone',  label: '未完了' },
      { value: 'isDone',  label: '完了済み' },
    ]
    // 選択している filterOptions の value を記憶するためのデータ。初期値を「すべて」にする
    const currentFilter = Vue.ref('all')

    // インスタンス作成時に自動的にlocalStorageの値を fetch() する
    todos.value = todoStorage.fetch()

    Vue.watch(todos, () => {
      todoStorage.save(todos.value)
    }, { deep: true }) // deep オプションでネストしているデータも監視できる

    const addTodo = () => {
      // テンプレート参照を使ってTODOの内容の入力値を参照
      const content = todoContent.value.value
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
      todoContent.value.value = ''
    }

    const removeTodo = (item) => {
      const targetIndex = todos.value.indexOf(item)
      todos.value.splice(targetIndex, 1)
    }

    const filterdTodos = Vue.computed(() => {
      if(currentFilter.value === 'all') return todos.value
      if(currentFilter.value === 'isDone') return todos.value.filter((todo) => todo.isDone === true)
      if(currentFilter.value === 'isNotDone') return todos.value.filter((todo) => todo.isDone === false)
    })

    // 状態をテンプレートに公開します
    return {
      todos,
      todoContent,
      filterOptions,
      currentFilter,
      addTodo,
      removeTodo,
      filterdTodos
    }
  }
}).mount('#app')
