
import {
  LayoutDashboard,
  CheckCircle2,
  CalendarDays,
  Settings,
  X,
  ListTodo,
  TrendingUp,
} from 'lucide-react'

function Sidebar({
  tasks,
  completedTasks,
  activeView,
  onViewChange,
  isOpen,
  onClose,
}) {
  const progress =
    tasks.length === 0
      ? 0
      : Math.min(
          100,
          Math.round((completedTasks / tasks.length) * 100),
        )

  const navigation = [
    {
      id: 'tasks',
      label: 'My Tasks',
      Icon: LayoutDashboard,
      count: tasks.length,
    },
    {
      id: 'completed',
      label: 'Completed',
      Icon: CheckCircle2,
      count: completedTasks,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      Icon: CalendarDays,
    },
    {
      id: 'settings',
      label: 'Settings',
      Icon: Settings,
    },
  ]

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        id="taskflow-sidebar"
        aria-label="Sidebar navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(82vw,288px)] flex-col overflow-y-auto overscroll-contain border-r border-slate-800 bg-slate-900 p-4 text-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-72 sm:p-6 md:sticky md:top-0 md:z-20 md:h-screen md:w-64 md:shrink-0 md:translate-x-0 md:shadow-none ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
              Task<span className="text-teal-400">Flow</span>
            </h1>

            <p className="mt-2 max-w-52 text-sm leading-5 text-slate-400">
              Organize your work. Simplify your life.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="mt-8 space-y-2 sm:mt-10"
          aria-label="Main navigation"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Workspace
          </p>

          {navigation.map(({ id, label, Icon, count }) => {
            const isActive = activeView === id

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onViewChange(id)
                  onClose()
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 sm:px-4 ${
                  isActive
                    ? 'bg-teal-500/15 font-semibold text-teal-300 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300'
                      : 'text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon size={19} strokeWidth={1.9} />
                </span>

                <span className="min-w-0 flex-1 truncate text-sm">
                  {label}
                </span>

                {count !== undefined && (
                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold tabular-nums ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-8 sm:pt-10">
          <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-800/60 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                <TrendingUp size={17} />
              </span>

              <p className="text-sm font-semibold text-slate-200">
                Your progress
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
              <p className="text-3xl font-bold tracking-tight text-white">
                {progress}%
              </p>

              <p className="text-right text-xs text-slate-400">
                {completedTasks}/{tasks.length} tasks
              </p>
            </div>

            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700"
              role="progressbar"
              aria-label="Task completion progress"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-teal-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Keep going, one task at a time.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ListTodo size={14} />
            <span>TaskFlow · Workspace</span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
