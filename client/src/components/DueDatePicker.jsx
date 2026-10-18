
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

function DueDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedDate = value
    ? new Date(`${value}T12:00:00`)
    : undefined

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Due Date
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left transition hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>
          {selectedDate
            ? format(selectedDate, 'dd MMM yyyy')
            : 'Select a due date'}
        </span>

        <span aria-hidden="true">▦</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? format(date, 'yyyy-MM-dd') : '')
              setIsOpen(false)
            }}
            disabled={{ before: new Date() }}
            showOutsideDays
          />

          <button
            type="button"
            onClick={() => {
              onChange('')
              setIsOpen(false)
            }}
            className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Clear date
          </button>
        </div>
      )}
    </div>
  )
}

export default DueDatePicker
