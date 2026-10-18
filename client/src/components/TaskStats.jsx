
function TaskStats({ totalTasks, completedTasks, pendingTasks }) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total Tasks</p>
        <p className="mt-3 text-3xl font-bold">{totalTasks}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Completed</p>
        <p className="mt-3 text-3xl font-bold text-teal-600">
          {completedTasks}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Pending</p>
        <p className="mt-3 text-3xl font-bold text-amber-600">
          {pendingTasks}
        </p>
      </div>
    </section>
  )
}

export default TaskStats
