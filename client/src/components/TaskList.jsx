
import { useState } from 'react'
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Code2,
  Dumbbell,
  ListTodo,
  Mail,
  Palette,
  ShoppingCart,
  UsersRound,
} from 'lucide-react'
import { format, isBefore, startOfDay } from 'date-fns'


function getTaskIcon(task) {
  const title = (task.title || '').toLowerCase()
  const category = (task.category || '').toLowerCase()
  const text = `${title} ${category}`

  if (/\b(code|coding|program|programming|developer|development|react|javascript|typescript|bug|api|website|app|software|git|github|debug)\b/.test(text)) {
    return { Icon: Code2, style: 'bg-violet-100 text-violet-700' }
  }

  if (/\b(meeting|team|call|interview|discussion|standup|sync|conference)\b/.test(title)) {
    return { Icon: UsersRound, style: 'bg-blue-100 text-blue-700' }
  }

  if (/\b(shop|shopping|buy|purchase|groceries|market|store|order)\b/.test(title)) {
    return { Icon: ShoppingCart, style: 'bg-orange-100 text-orange-700' }
  }

  if (/\b(study|learn|learning|read|reading|course|lesson|exam|practice|homework|assignment|research|book)\b/.test(text)) {
    return { Icon: BookOpen, style: 'bg-sky-100 text-sky-700' }
  }

  if (/\b(design|designing|ui|ux|figma|creative|art|logo|prototype|wireframe)\b/.test(title)) {
    return { Icon: Palette, style: 'bg-pink-100 text-pink-700' }
  }

  if (/\b(email|mail|inbox|reply|message|newsletter)\b/.test(title)) {
    return { Icon: Mail, style: 'bg-emerald-100 text-emerald-700' }
  }

  if (/\b(work|office|report|project|client|deadline|business|task|proposal)\b/.test(text)) {
    return { Icon: Briefcase, style: 'bg-amber-100 text-amber-700' }
  }

  if (/\b(workout|gym|exercise|fitness|run|running|yoga|walk|walking)\b/.test(title)) {
    return { Icon: Dumbbell, style: 'bg-rose-100 text-rose-700' }
  }

  if (/\b(calendar|schedule|appointment|event|plan|planning)\b/.test(title)) {
    return { Icon: CalendarDays, style: 'bg-cyan-100 text-cyan-700' }
  }

  return { Icon: ListTodo, style: 'bg-teal-100 text-teal-700' }
}

function TaskList({ tasks, toggleTask, deleteTask, editTask, showModal }) {
  const [editingId, setEditingId] = useState(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedCategory, setEditedCategory] = useState('')
  const [editedPriority, setEditedPriority] = useState('')
  const [editedDueDate, setEditedDueDate] = useState('')

  function startEditing(task) {
    setEditingId(task.id)
    setEditedTitle(task.title)
    setEditedCategory(task.category || '')
    setEditedPriority(task.priority || '')
    setEditedDueDate(task.dueDate || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditedTitle('')
    setEditedCategory('')
    setEditedPriority('')
    setEditedDueDate('')
  }

  function saveEdit(id) {
    const title = editedTitle.trim()

    if (!title) {
      showModal({
        type: 'error',
        title: 'Task name required',
        message: 'Please enter a task name before saving your changes.',
      })
      return
    }

    if (title.length > 100) {
      showModal({
        type: 'error',
        title: 'Task name too long',
        message: 'Your task name cannot exceed 100 characters.',
      })
      return
    }

    const saved = editTask(
      id,
      title,
      editedCategory,
      editedPriority,
      editedDueDate,
    )

    if (saved) {
      cancelEdit()
    }
  }

  function confirmDelete(task) {
    showModal({
      type: 'confirm',
      title: 'Delete this task?',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete Task',
      onConfirm: () => deleteTask(task.id),
    })
  }

  function getPriorityStyle(priority) {
    if (priority === 'High') return 'bg-red-100 text-red-700'
    if (priority === 'Low') return 'bg-slate-100 text-slate-600'
    return 'bg-amber-100 text-amber-700'
  }

  function formatDueDate(date) {
    if (!date) return ''

    try {
      return format(new Date(`${date}T12:00:00`), 'dd MMM yyyy')
    } catch {
      return date
    }
  }

  function isTaskOverdue(task) {
    if (!task.dueDate || task.completed) return false

    const dueDate = new Date(`${task.dueDate}T12:00:00`)
    return isBefore(dueDate, startOfDay(new Date()))
  }

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
          No tasks found. Add a task or change your search.
        </p>
      ) : (
        tasks.map((task, index) => {
          const overdue = isTaskOverdue(task)
          const { Icon: TaskIcon, style: taskIconStyle } = getTaskIcon(task)

          return (
            <div
              key={task.id}
              className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-teal-200 hover:shadow-sm sm:items-center"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                {index + 1}
              </span>

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark ${task.title} as completed`}
                className="mt-1 h-5 w-5 shrink-0 accent-teal-600 sm:mt-0"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {editingId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editedTitle}
                      maxLength={100}
                      onChange={(event) =>
                        setEditedTitle(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') saveEdit(task.id)
                        if (event.key === 'Escape') cancelEdit()
                      }}
                      aria-label="Edit task title"
                      autoFocus
                      className="w-full min-w-0 rounded-lg border border-teal-500 px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-teal-100"
                    />

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Category (optional)
                      </label>

                      <select
                        value={editedCategory}
                        onChange={(event) =>
                          setEditedCategory(event.target.value)
                        }
                        aria-label="Edit task category"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-teal-500"
                      >
                        <option value="">No category</option>
                        <option value="Personal">Personal</option>
                        <option value="Learning">Learning</option>
                        <option value="Work">Work</option>
                        <option value="Development">Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Priority (optional)
                      </label>

                      <select
                        value={editedPriority}
                        onChange={(event) =>
                          setEditedPriority(event.target.value)
                        }
                        aria-label="Edit task priority"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-teal-500"
                      >
                        <option value="">No priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Due Date (optional)
                      </label>

                      <input
                        type="date"
                        value={editedDueDate}
                        onChange={(event) =>
                          setEditedDueDate(event.target.value)
                        }
                        aria-label="Edit task due date"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-teal-500"
                      />

                      {editedDueDate && (
                        <button
                          type="button"
                          onClick={() => setEditedDueDate('')}
                          className="mt-1 text-xs font-medium text-slate-500 hover:text-red-600"
                        >
                          Clear date
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${taskIconStyle}`}
                        aria-hidden="true"
                      >
                        <TaskIcon size={18} strokeWidth={1.9} />
                      </span>
                      <p
                        className={`min-w-0 break-words font-medium ${
                          task.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>

                    {(task.category || task.priority || task.dueDate) && (
                      <div className="flex flex-wrap items-center gap-2">
                        {task.category && (
                          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                            {task.category}
                          </span>
                        )}

                        {task.priority && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(
                              task.priority,
                            )}`}
                          >
                            {task.priority} Priority
                          </span>
                        )}

                        {task.dueDate && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              overdue
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {overdue
                              ? `Overdue: ${formatDueDate(task.dueDate)}`
                              : `Due: ${formatDueDate(task.dueDate)}`}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {editingId === task.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(task.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => confirmDelete(task)}
                  aria-label={`Delete ${task.title}`}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default TaskList
