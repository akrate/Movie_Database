const GENRES = [
  { value: "all", label: "All Genres" },
  { value: "Action", label: "Action" },
  { value: "Drama", label: "Drama" },
  { value: "Comedy", label: "Comedy" },
  { value: "Horror", label: "Horror" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Thriller", label: "Thriller" },
];

export default function GenreSelect({ value, onChange }) {
  return (
    <select
      className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-slate-600"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {GENRES.map((g) => (
        <option key={g.value} value={g.value}>
          {g.label}
        </option>
      ))}
    </select>
  );
}
