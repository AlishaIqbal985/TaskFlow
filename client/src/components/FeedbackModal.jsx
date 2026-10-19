
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
  const closeButtonRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!modal) return

    previousFocusRef.current = document.activeElement

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      if (event.key === 'Tab') {
        const dialog = document.getElementById('feedback-modal-dialog')

        if (!dialog) return

        const focusableElements = dialog.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )

        const elements = Array.from(focusableElements)

        if (elements.length === 0) return

        const firstElement = elements[0]
        const lastElement = elements[elements.length - 1]

        if (
          event.shiftKey &&
          (document.activeElement === firstElement ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault()
          lastElement.focus()
        } else if (
          !event.shiftKey &&
          (document.activeElement === lastElement ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const focusTarget =
      cancelButtonRef.current || closeButtonRef.current

    focusTarget?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow

      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus()
      }
    }
  }, [modal, onClose])

  if (!modal) return null

  const isConfirm = modal.type === 'confirm'
  const isSuccess = modal.type === 'success'
  const isError = modal.type === 'error'

  const title =
    modal.title ||
    (isConfirm ? 'Are you sure?' : isSuccess ? 'Success!' : 'Notice')

  const message = modal.message || ''

  const isDeleteAction = /delete|clear all|remove/i.test(
    `${title} ${message} ${modal.confirmText || ''}`,
  )

  const isLogoutAction = /logout|log out|sign out/i.test(
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
    ? 'bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
    : isSuccess
      ? 'bg-teal-50 text-teal-600 ring-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/20'
      : isError
        ? 'bg-red-50 text-red-600 ring-red-100 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
        : 'bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20'

  const confirmStyle = isDeleteAction
    ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-300'
    : isLogoutAction
      ? 'bg-slate-800 hover:bg-slate-900 focus-visible:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
      : 'bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-300'

  const ConfirmIcon = isDeleteAction
    ? Trash2
    : isLogoutAction
      ? LogOut
      : ArrowRight

  const accentStyle = isConfirm
    ? 'bg-rose-500'
    : isSuccess
      ? 'bg-teal-500'
      : isError
        ? 'bg-red-500'
        : 'bg-blue-500'

  const primaryButtonStyle = isSuccess
    ? 'bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-300'
    : isError
      ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-300'
      : 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-300'

  function handleConfirm() {
    const confirmAction = modal.onConfirm

    onClose()

    if (typeof confirmAction === 'function') {
      confirmAction()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/60 p-3 backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        id="feedback-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-message"
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-x-hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 motion-reduce:animate-none sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-3xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className={`h-1.5 w-full ${accentStyle}`} />

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:right-4 sm:top-5 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X size={19} />
        </button>

        <div className="p-4 sm:p-7 md:p-8">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 sm:mb-5 sm:h-14 sm:w-14 ${iconStyle}`}
            aria-hidden="true"
          >
            <Icon size={25} strokeWidth={2.2} />
          </div>

          <h2
            id="feedback-modal-title"
            className="break-words pr-10 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white"
          >
            {title}
          </h2>

          <p
            id="feedback-modal-message"
            className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300"
          >
            {message}
          </p>

          {isConfirm && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:mt-5 sm:rounded-2xl sm:p-3.5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />

                <p className="break-words text-xs leading-5 text-amber-800 sm:text-sm dark:text-amber-200">
                  {isDeleteAction
                    ? 'Please review this action carefully. Deleted tasks may not be recoverable.'
                    : isLogoutAction
                      ? 'You will need to sign in again to access your account.'
                      : 'Please review this action before continuing.'}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:mt-7 sm:flex-row sm:justify-end sm:gap-3">
            {isConfirm && (
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-[0.98] sm:w-auto sm:min-w-28 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            )}

            {isConfirm ? (
              <button
                type="button"
                onClick={handleConfirm}
                className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 active:scale-[0.98] sm:w-auto sm:min-w-32 ${confirmStyle}`}
              >
                <ConfirmIcon size={16} aria-hidden="true" />
                <span className="break-words">
                  {modal.confirmText ||
                    (isDeleteAction
                      ? 'Delete'
                      : isLogoutAction
                        ? 'Log out'
                        : 'Confirm')}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 active:scale-[0.98] sm:w-auto ${primaryButtonStyle}`}
              >
                {isSuccess ? (
                  <CheckCircle2 size={17} aria-hidden="true" />
                ) : (
                  <RotateCcw size={16} aria-hidden="true" />
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
