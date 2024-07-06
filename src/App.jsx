import Sidebar from "./Components/Sidebar";
import AppLayout from "./Components/AppLayout";
import ChartGrid from "./Components/ChartGrid";
import { useState } from "react";

const App = () => {
  const [albumFilter, setAlbumFilter] = useState("single");
  const [popularity, setPopularity] = useState("60");
  return (
    <div id="app">
      <AppLayout>
        <Sidebar
          albumFilter={albumFilter}
          setAlbumFilter={setAlbumFilter}
          popularity={popularity}
          setPopularity={setPopularity}
        />
        <ChartGrid albumFilter={albumFilter} popularity={popularity} />
      </AppLayout>
    </div>
  );
};

export default App;
