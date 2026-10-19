
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
  Pencil,
  Trash2,
  Save,
  X,
  CalendarClock,
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

    const parsedDate = new Date(`${date}T12:00:00`)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return format(parsedDate, 'dd MMM yyyy')
  }

  function isTaskOverdue(task) {
    if (!task.dueDate || task.completed) return false

    const dueDate = new Date(`${task.dueDate}T12:00:00`)

    if (Number.isNaN(dueDate.getTime())) return false

    return isBefore(dueDate, startOfDay(new Date()))
  }

  return (
    <div className="min-w-0 space-y-3">
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center sm:px-6">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <ListTodo size={24} />
          </span>

          <p className="mt-3 font-semibold text-slate-700">
            No tasks found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add a task or change your search and filters.
          </p>
        </div>
      ) : (
        tasks.map((task, index) => {
          const overdue = isTaskOverdue(task)
          const { Icon: TaskIcon, style: taskIconStyle } = getTaskIcon(task)
          const isEditing = editingId === task.id

          return (
            <article
              key={task.id}
              className={`min-w-0 rounded-2xl border bg-white p-3 transition duration-200 hover:border-teal-200 hover:shadow-sm sm:p-4 ${
                task.completed
                  ? 'border-slate-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700 sm:h-8 sm:w-8 sm:text-sm">
                  {index + 1}
                </span>

                <input
                  type="checkbox"
                  checked={Boolean(task.completed)}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.title} as completed`}
                  className="mt-2 h-5 w-5 shrink-0 cursor-pointer accent-teal-600"
                />

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor={`task-title-${task.id}`}
                          className="mb-1.5 block text-xs font-semibold text-slate-600"
                        >
                          Task name
                        </label>

                        <input
                          id={`task-title-${task.id}`}
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
                          autoFocus
                          className="w-full min-w-0 rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />

                        <p className="mt-1 text-right text-xs text-slate-400">
                          {editedTitle.length}/100
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="min-w-0">
                          <label
                            htmlFor={`task-category-${task.id}`}
                            className="mb-1.5 block text-xs font-semibold text-slate-600"
                          >
                            Category
                          </label>

                          <select
                            id={`task-category-${task.id}`}
                            value={editedCategory}
                            onChange={(event) =>
                              setEditedCategory(event.target.value)
                            }
                            className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                          >
                            <option value="">No category</option>
                            <option value="Personal">Personal</option>
                            <option value="Learning">Learning</option>
                            <option value="Work">Work</option>
                            <option value="Development">Development</option>
                          </select>
                        </div>

                        <div className="min-w-0">
                          <label
                            htmlFor={`task-priority-${task.id}`}
                            className="mb-1.5 block text-xs font-semibold text-slate-600"
                          >
                            Priority
                          </label>

                          <select
                            id={`task-priority-${task.id}`}
                            value={editedPriority}
                            onChange={(event) =>
                              setEditedPriority(event.target.value)
                            }
                            className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                          >
                            <option value="">No priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`task-due-${task.id}`}
                          className="mb-1.5 block text-xs font-semibold text-slate-600"
                        >
                          Due date
                        </label>

                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <input
                            id={`task-due-${task.id}`}
                            type="date"
                            value={editedDueDate}
                            onChange={(event) =>
                              setEditedDueDate(event.target.value)
                            }
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                          />

                          {editedDueDate && (
                            <button
                              type="button"
                              onClick={() => setEditedDueDate('')}
                              className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Clear date
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => saveEdit(task.id)}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:flex-none"
                        >
                          <Save size={16} />
                          Save changes
                        </button>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:flex-none"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${taskIconStyle}`}
                          aria-hidden="true"
                        >
                          <TaskIcon size={18} strokeWidth={1.9} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`break-words text-sm font-semibold leading-6 sm:text-base ${
                              task.completed
                                ? 'text-slate-400 line-through'
                                : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </p>

                          {task.completed && (
                            <span className="mt-1 inline-block text-xs font-medium text-teal-700">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {(task.category || task.priority || task.dueDate) && (
                        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
                          {task.category && (
                            <span className="max-w-full break-words rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
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
                              className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                overdue
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <CalendarClock size={13} className="shrink-0" />
                              <span className="break-words">
                                {overdue ? 'Overdue: ' : 'Due: '}
                                {formatDueDate(task.dueDate)}
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!isEditing && (
                <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:mt-2">
                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    aria-label={`Edit ${task.title}`}
                    className="inline-flex min-h-10 min-w-20 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => confirmDelete(task)}
                    aria-label={`Delete ${task.title}`}
                    className="inline-flex min-h-10 min-w-20 items-center justify-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              )}
            </article>
          )
        })
      )}
    </div>
  )
}

export default TaskList
