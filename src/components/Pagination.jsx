export default function Pagination({ page, totalResults, onPrev, onNext, disabled }) {
  const maxPage = Math.max(1, Math.ceil((totalResults || 0) / 10));
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 disabled:opacity-50"
        onClick={onPrev}
        disabled={disabled || page <= 1}
      >
        Prev
      </button>
      <div className="text-sm text-slate-400">
        Page {page} of {maxPage}
      </div>
      <button
        className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 disabled:opacity-50"
        onClick={onNext}
        disabled={disabled || page >= maxPage}
      >
        Next
      </button>
    </div>
  );
}
