export default function Sidebar({
  albumFilter,
  setAlbumFilter,
  popularity,
  setPopularity,
}) {
  return (
    <aside className="sidebar">
      <h1>Spotify 2023</h1>
      <h4>Album Type:</h4>
      <select
        value={albumFilter}
        onChange={(e) => setAlbumFilter(e.target.value)}
      >
        <option value="single">Single</option>
        <option value="album">Album</option>
      </select>

      <h4>Popularity</h4>
      <select
        value={popularity}
        onChange={(e) => setPopularity(e.target.value)}
      >
        <option value={20}>More Than 20</option>
        <option value={40}>More Than 40</option>
        <option value={50}>More Than 50</option>
        <option value={60}>More Than 60</option>
        <option value={70}>More Than 70</option>
      </select>
    </aside>
  );
}
