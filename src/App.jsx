import { useMemo, useState } from 'react'

const startingTasks = [
  { id: 1, title: 'Review the product roadmap', time: '09:00', category: 'Focus', done: true },
  { id: 2, title: 'Morning pages & coffee', time: '09:30', category: 'Personal', done: true },
  { id: 3, title: 'Design sprint with the team', time: '11:00', category: 'Work', done: false },
  { id: 4, title: 'Send the launch notes', time: '13:30', category: 'Work', done: false },
  { id: 5, title: 'A little fresh air', time: '16:00', category: 'Personal', done: false },
]

const filters = ['All tasks', 'To do', 'Completed']

function App() {
  const [tasks, setTasks] = useState(startingTasks)
  const [filter, setFilter] = useState('All tasks')
  const [newTask, setNewTask] = useState('')
  const completedCount = tasks.filter((task) => task.done).length
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0
  const visibleTasks = useMemo(
    () => tasks.filter((task) => {
      if (filter === 'To do') return !task.done
      if (filter === 'Completed') return task.done
      return true
    }),
    [filter, tasks],
  )
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  function addTask(event) {
    event.preventDefault()
    const title = newTask.trim()
    if (!title) return
    setTasks((current) => [
      ...current,
      { id: Date.now(), title, time: 'Anytime', category: 'New', done: false },
    ])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    )
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  function clearCompletedTasks() {
    setTasks((current) => current.filter((task) => !task.done))
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#today" aria-label="Orbit home">
          <span className="brand-mark">o</span>
          <span>orbit<span className="brand-period">.</span></span>
        </a>

        <div className="side-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          <a className="nav-item active" href="#today"><span className="nav-icon">◷</span> My day</a>
          <a className="nav-item" href="#upcoming"><span className="nav-icon">▦</span> Upcoming</a>
          <a className="nav-item" href="#tasks"><span className="nav-icon">⌑</span> All tasks <span className="nav-count">{tasks.length}</span></a>
        </nav>

        <div className="side-label projects-label">YOUR SPACE</div>
        <div className="project-link"><span className="project-dot dot-lilac" /> Personal</div>
        <div className="project-link"><span className="project-dot dot-orange" /> Work things</div>
        <button className="add-project" type="button" onClick={() => document.querySelector('#new-task')?.focus()}>
          <span>＋</span> Add a task
        </button>

        <div className="sidebar-bottom">
          <div className="quote-mark">“</div>
          <p>Small steps every day add up to big change.</p>
          <span>THE ORBIT NOTE</span>
          <div className="profile">
            <div className="avatar">A</div>
            <div><strong>Alex Morgan</strong><small>Free plan</small></div>
            <span className="profile-more">···</span>
          </div>
        </div>
      </aside>

      <section className="main-panel" id="today">
        <header className="topbar">
          <div className="breadcrumb">My workspace <span>/</span> <strong>My day</strong></div>
          <button className="icon-button" aria-label="Notifications" type="button">♧<i /></button>
        </header>

        <div className="content">
          <div className="greeting-row">
            <div>
              <div className="date-label">{today}</div>
              <h1>Make today <span>count.</span></h1>
              <p className="intro">A little progress each day adds up to big results.</p>
            </div>
            <div className="sun-art" aria-hidden="true">
              <div className="sun-rays" />
              <div className="sun-disc" />
              <div className="sun-hill hill-back" />
              <div className="sun-hill hill-front" />
            </div>
          </div>

          <section className="progress-card" aria-label="Daily progress">
            <div className="progress-copy">
              <div className="progress-title">Your daily progress <span className="sparkle">✳</span></div>
              <div className="progress-subtitle">
                {completedCount} of {tasks.length} tasks completed
                <span>·</span>
                {tasks.length > 0 && completedCount === tasks.length
                  ? 'You did it. Enjoy the rest of your day!'
                  : completedCount > 0
                    ? 'You’re building good momentum.'
                    : 'Every small step counts.'}
              </div>
            </div>
            <div className="progress-meter">
              <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
              <strong>{progress}%</strong>
            </div>
          </section>

          <section className="tasks-section" id="tasks">
            <div className="section-heading">
              <div>
                <h2>Today’s tasks <span className="task-total">{tasks.length}</span></h2>
                <p>One thing at a time.</p>
              </div>
              <div className="filters" role="group" aria-label="Filter tasks">
                {completedCount > 0 && (
                  <button className="clear-completed" onClick={clearCompletedTasks} type="button">
                    Clear completed
                  </button>
                )}
                {filters.map((item) => (
                  <button
                    className={filter === item ? 'filter-button selected' : 'filter-button'}
                    key={item}
                    onClick={() => setFilter(item)}
                    type="button"
                  >{item}</button>
                ))}
              </div>
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => (
                <article className={task.done ? 'task-row is-done' : 'task-row'} key={task.id}>
                  <button
                    aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
                    aria-pressed={task.done}
                    className="task-check"
                    onClick={() => toggleTask(task.id)}
                    type="button"
                  >{task.done && <span>✓</span>}</button>
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta"><span className="task-time">{task.time}</span><span className={`tag tag-${task.category.toLowerCase().replace(' ', '-')}`}>{task.category}</span></div>
                  </div>
                  <button
                    className="task-delete"
                    onClick={() => deleteTask(task.id)}
                    type="button"
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >×</button>
                </article>
              ))}
              {visibleTasks.length === 0 && <div className="empty-state">Nothing here just yet. Enjoy the breathing room.</div>}
            </div>

            <form className="new-task-form" onSubmit={addTask}>
              <span className="new-task-plus">＋</span>
              <input
                id="new-task"
                onChange={(event) => setNewTask(event.target.value)}
                placeholder="Add a task..."
                value={newTask}
                aria-label="New task"
              />
              {newTask.trim() && <button type="submit">Add task</button>}
            </form>
          </section>

          <section className="focus-card" id="upcoming">
            <div className="focus-icon">✺</div>
            <div><strong>Make space to focus</strong><p>Try a 25-minute focus session on your next task.</p></div>
            <button type="button" onClick={() => document.querySelector('#new-task')?.focus()}>Sounds good <span>↗</span></button>
          </section>
          <footer>Made for your pace <span>·</span> Take it one day at a time <span className="footer-heart">♥</span></footer>
        </div>
      </section>
    </main>
  )
}

export default App
