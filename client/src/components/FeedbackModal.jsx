
function FeedbackModal({ modal, onClose }) {
  if (!modal) return null

  const isConfirm = modal.type === 'confirm'
  const isSuccess = modal.type === 'success'

  const iconStyle = isSuccess
    ? 'bg-teal-100 text-teal-700'
    : isConfirm
      ? 'bg-red-100 text-red-600'
      : 'bg-amber-100 text-amber-700'

  function handleConfirm() {
    const confirmAction = modal.onConfirm

    onClose()

    if (confirmAction) {
      confirmAction()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-message"
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-2xl transition duration-200 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ${iconStyle}`}
          aria-hidden="true"
        >
          {isSuccess ? '✓' : isConfirm ? '!' : 'i'}
        </div>

        <h2
          id="feedback-modal-title"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          {modal.title}
        </h2>

        <p
          id="feedback-modal-message"
          className="mt-3 break-words text-sm leading-6 text-slate-600"
        >
          {modal.message}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {isConfirm && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
          )}

          {isConfirm ? (
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              {modal.confirmText || 'Delete Task'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {isSuccess ? 'Continue' : 'Got it'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default FeedbackModal
