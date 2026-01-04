export default function SearchBar({ value, onChange, onSearch, loading }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-slate-600"
        placeholder="Search movies... (min 3 letters)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />
      <button
        className="rounded-2xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
        onClick={onSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
