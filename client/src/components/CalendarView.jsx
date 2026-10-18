
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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const calendarStart = startOfWeek(startOfMonth(currentMonth))
  const calendarEnd = endOfWeek(endOfMonth(currentMonth))

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const selectedTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      isSameDay(
        new Date(`${task.dueDate}T12:00:00`),
        selectedDate,
      ),
  )

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Monthly Calendar
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Select a date to view its tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setCurrentMonth((month) => subMonths(month, 1))
            }
            aria-label="Previous month"
            className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-100"
          >
            ←
          </button>

          <h4 className="min-w-32 text-center font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h4>

          <button
            type="button"
            onClick={() =>
              setCurrentMonth((month) => addMonths(month, 1))
            }
            aria-label="Next month"
            className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
          (day) => (
            <div
              key={day}
              className="py-2 text-xs font-semibold text-slate-500 sm:text-sm"
            >
              {day}
            </div>
          ),
        )}

        {days.map((day) => {
          const dayTasks = tasks.filter(
            (task) =>
              task.dueDate &&
              isSameDay(
                new Date(`${task.dueDate}T12:00:00`),
                day,
              ),
          )

          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={format(day, 'yyyy-MM-dd')}
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`flex min-h-16 flex-col items-center rounded-xl border p-1 transition sm:min-h-20 sm:p-2 ${
                isSelected
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
              } ${
                isCurrentMonth ? 'text-slate-800' : 'text-slate-300'
              }`}
            >
              <span className="text-sm font-medium">
                {format(day, 'd')}
              </span>

              {dayTasks.length > 0 && (
                <span className="mt-1 max-w-full truncate rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800 sm:text-xs">
                  {dayTasks.length} task
                  {dayTasks.length > 1 ? 's' : ''}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h4 className="font-semibold text-slate-900">
          Tasks for {format(selectedDate, 'dd MMMM yyyy')}
        </h4>

        {selectedTasks.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No tasks are scheduled for this date.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selectedTasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3"
              >
                <span className="font-medium text-slate-800">
                  {task.title}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
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
