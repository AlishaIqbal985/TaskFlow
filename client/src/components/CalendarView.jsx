
import { useState } from 'react'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns'

function CalendarView({ tasks }) {
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date()),
  )
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Calendar week Monday se start hogi.
  const calendarStart = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 1,
  })

  const calendarEnd = endOfWeek(endOfMonth(currentMonth), {
    weekStartsOn: 1,
  })

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const getTasksForDate = (date) =>
    tasks.filter((task) => {
      if (!task.dueDate) return false

      const taskDate = new Date(`${task.dueDate}T12:00:00`)

      return (
        !Number.isNaN(taskDate.getTime()) &&
        isSameDay(taskDate, date)
      )
    })

  const selectedTasks = getTasksForDate(selectedDate)

  const changeMonth = (direction) => {
    const newMonth =
      direction === 'previous'
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1)

    setCurrentMonth(newMonth)
    setSelectedDate(startOfMonth(newMonth))
  }

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 md:p-7">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Monthly Calendar
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Select a date to view its tasks.
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 sm:w-auto sm:justify-start sm:bg-transparent sm:p-0">
          <button
            type="button"
            onClick={() => changeMonth('previous')}
            aria-label="Previous month"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            ←
          </button>

          <h4 className="min-w-0 flex-1 text-center text-sm font-semibold text-slate-800 sm:min-w-32 sm:flex-none sm:text-base">
            {format(currentMonth, 'MMMM yyyy')}
          </h4>

          <button
            type="button"
            onClick={() => changeMonth('next')}
            aria-label="Next month"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
          (day) => (
            <div
              key={day}
              className="py-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs"
            >
              {day}
            </div>
          ),
        )}

        {days.map((day) => {
          const dayTasks = getTasksForDate(day)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={format(day, 'yyyy-MM-dd')}
              type="button"
              onClick={() => setSelectedDate(day)}
              aria-pressed={isSelected}
              aria-label={`${format(day, 'EEEE, d MMMM yyyy')}, ${dayTasks.length} task${dayTasks.length === 1 ? '' : 's'}`}
              className={`flex min-h-12 min-w-0 flex-col items-center justify-start gap-1 rounded-lg border p-1 transition focus:outline-none focus:ring-2 focus:ring-teal-500 sm:min-h-20 sm:rounded-xl sm:p-2 ${
                isSelected
                  ? 'border-teal-600 bg-teal-50 shadow-sm'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
              } ${
                isCurrentMonth
                  ? 'text-slate-800'
                  : 'text-slate-300'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-7 sm:w-7 sm:text-sm ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : ''
                }`}
              >
                {format(day, 'd')}
              </span>

              {dayTasks.length > 0 && (
                <>
                  <span className="hidden max-w-full truncate rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800 sm:inline-block sm:text-xs">
                    {dayTasks.length} task
                    {dayTasks.length > 1 ? 's' : ''}
                  </span>

                  <span
                    className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-600 sm:hidden"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 sm:mt-6 sm:pt-5">
        <h4 className="break-words text-sm font-bold text-slate-900 sm:text-base">
          Tasks for {format(selectedDate, 'dd MMMM yyyy')}
        </h4>

        {selectedTasks.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center sm:px-5">
            <p className="text-sm text-slate-500">
              No tasks are scheduled for this date.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {selectedTasks.map((task) => (
              <li
                key={task.id}
                className="flex min-w-0 flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:p-4"
              >
                <span className="min-w-0 break-words text-sm font-medium text-slate-800 sm:text-base">
                  {task.title}
                </span>

                <span
                  className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    task.completed
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default CalendarView
