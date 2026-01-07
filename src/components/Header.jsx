function Header({ onHome, onFavorites }) {
  return (
    <header>
      <h1>🎬 Movie Database</h1>
      <button onClick={onHome}>Home</button>
      <button onClick={onFavorites}>⭐ Favorites</button>
    </header>
  );
}

export default Header;
