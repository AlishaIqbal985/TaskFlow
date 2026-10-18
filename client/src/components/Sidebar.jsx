
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
      : Math.round((completedTasks / tasks.length) * 100)

  const navigation = [
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: '▤',
      count: tasks.length,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: '✓',
      count: completedTasks,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '▦',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙',
    },
  ]

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-auto bg-slate-900 p-6 text-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:w-64 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Task<span className="text-teal-400">Flow</span>
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Organize your work. Simplify your life.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 md:hidden"
          >
            ✕
          </button>
        </div>

        <nav
          className="mt-10 space-y-2"
          aria-label="Main navigation"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          {navigation.map((item) => {
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onViewChange(item.id)
                  onClose()
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition duration-200 ${
                  isActive
                    ? 'bg-teal-500/15 font-semibold text-teal-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>

                <span className="flex-1">{item.label}</span>

                {item.count !== undefined && (
                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-10">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
            <p className="text-sm font-medium text-slate-300">
              Your progress
            </p>

            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="text-3xl font-bold">{progress}%</p>
              <p className="text-xs text-slate-400">
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
                className="h-full rounded-full bg-teal-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Keep going, one task at a time.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            TaskFlow · Workspace
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
