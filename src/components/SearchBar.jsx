function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="Search movies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
