
import { useEffect, useRef } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  ArrowRight,
  Trash2,
  LogOut,
  RotateCcw,
} from 'lucide-react'

function FeedbackModal({ modal, onClose }) {
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (!modal) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modal, onClose])

  if (!modal) return null

  const isConfirm = modal.type === 'confirm'
  const isSuccess = modal.type === 'success'
  const isError = modal.type === 'error'

  const title = modal.title || (
    isConfirm ? 'Are you sure?' : isSuccess ? 'Success!' : 'Notice'
  )

  const message = modal.message || ''

  const isDeleteAction =
    /delete|clear all|remove/i.test(
      `${title} ${message} ${modal.confirmText || ''}`,
    )

  const isLogoutAction =
    /logout|log out|sign out/i.test(
      `${title} ${message} ${modal.confirmText || ''}`,
    )

  const Icon = isConfirm
    ? AlertTriangle
    : isSuccess
      ? CheckCircle2
      : isError
        ? AlertTriangle
        : Info

  const iconStyle = isConfirm
    ? 'bg-rose-50 text-rose-600 ring-rose-100'
    : isSuccess
      ? 'bg-teal-50 text-teal-600 ring-teal-100'
      : isError
        ? 'bg-red-50 text-red-600 ring-red-100'
        : 'bg-blue-50 text-blue-600 ring-blue-100'

  const confirmStyle = isDeleteAction
    ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-300'
    : isLogoutAction
      ? 'bg-slate-800 hover:bg-slate-900 focus-visible:ring-slate-300'
      : 'bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-300'

  const ConfirmIcon = isDeleteAction
    ? Trash2
    : isLogoutAction
      ? LogOut
      : ArrowRight

  function handleConfirm() {
    const confirmAction = modal.onConfirm

    onClose()

    if (typeof confirmAction === 'function') {
      confirmAction()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-message"
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-950/20 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
      >
        <div
          className={`h-1.5 w-full ${
            isConfirm
              ? 'bg-rose-500'
              : isSuccess
                ? 'bg-teal-500'
                : isError
                  ? 'bg-red-500'
                  : 'bg-blue-500'
          }`}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <X size={19} />
        </button>

        <div className="p-6 sm:p-8">
          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${iconStyle}`}
            aria-hidden="true"
          >
            <Icon size={27} strokeWidth={2.2} />
          </div>

          <h2
            id="feedback-modal-title"
            className="pr-8 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            {title}
          </h2>

          <p
            id="feedback-modal-message"
            className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-600 sm:text-base"
          >
            {message}
          </p>

          {isConfirm && (
            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/80 p-3.5">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <p className="text-xs leading-5 text-amber-800 sm:text-sm">
                  {isDeleteAction
                    ? 'Please review this action carefully. Deleted tasks may not be recoverable.'
                    : isLogoutAction
                      ? 'You will need to sign in again to access your account.'
                      : 'Please review this action before continuing.'}
                </p>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {isConfirm && (
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 active:scale-[0.98] sm:min-w-28"
              >
                Cancel
              </button>
            )}

            {isConfirm ? (
              <button
                type="button"
                onClick={handleConfirm}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 active:scale-[0.98] sm:min-w-32 ${confirmStyle}`}
              >
                <ConfirmIcon size={16} />
                {modal.confirmText ||
                  (isDeleteAction
                    ? 'Delete'
                    : isLogoutAction
                      ? 'Log out'
                      : 'Confirm')}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 active:scale-[0.98] ${
                  isSuccess
                    ? 'bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-300'
                    : isError
                      ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-300'
                      : 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-300'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <RotateCcw size={16} />
                )}
                {isSuccess ? 'Continue' : 'Got it'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeedbackModal
