import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement,
  PointElement,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
  ArcElement
);

// Spotify API credentials
const clientId = "5660024d724448c68fb93d2fd69363d6";
const clientSecret = "56efe52217234465af3b7cdc678e331e";

const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
    }
  );
  return response.data.access_token;
};

const fetchSpotifyData = async (accessToken) => {
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q: "year:2023-2024 market:IN",
      type: "track",
      limit: 50,
    },
  });
  return response.data.tracks.items;
};

export default function ChartGrid({ albumFilter, popularity }) {
  const [chartData, setChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [filteredTracks, setFilteredTracks] = useState([]);

  useEffect(() => {
    console.log("1-effect");
    const filterTracks = () => {
      let filtered = filteredTracks;

      // Apply Album filter
      if (albumFilter) {
        filtered = filtered.filter(
          (track) =>
            track.album.album_type && track.album.album_type === albumFilter
        );
      }
      // Apply Popularity filter
      if (popularity) {
        filtered = filtered.filter(
          (track) => track.popularity && track.popularity > popularity
        );
      }
      console.log("filtered", filtered);

      updateCharts(filtered);
    };

    filterTracks();
  }, [albumFilter, popularity, filteredTracks]);

  useEffect(() => {
    console.log("2-effect");
    const getData = async () => {
      try {
        const token = await getAccessToken();
        const tracks = await fetchSpotifyData(token);

        setFilteredTracks(tracks);
        updateCharts(tracks);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    getData();
  }, []);

  function updateCharts(tracks) {
    const trackNames = tracks.map((track) => track.name);
    const releaseDates = tracks.map((track) =>
      new Date(track.album.release_date).getTime()
    );

    console.log("Barchart", trackNames);
    console.log("Barchart", releaseDates);

    setChartData({
      labels: trackNames,
      datasets: [
        {
          label: "Release Date",
          data: releaseDates,
          backgroundColor: "rgba(93, 192, 75, 0.6)",
          borderColor: "rgba(93, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });

    // Prepare data for pie chart (popularity)
    const popularityLabels = tracks.map((track) => track.name);
    const popularityValues = tracks.map((track) => track.popularity);

    setPieChartData({
      labels: popularityLabels,
      datasets: [
        {
          label: "Popularity",
          data: popularityValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });

    // Prepare data for line chart (track duration)
    const durationLabels = tracks.map((track) => track.name);
    const durationValues = tracks.map((track) => track.duration_ms);

    setLineChartData({
      labels: durationLabels,
      datasets: [
        {
          label: "Track Duration (ms)",
          data: durationValues,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    });
  }

  return (
    <div className="chart-layout">
      <div className="bar">
        <h3>Bar Chart (Release Date)</h3>
        {chartData.labels ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Songs Released in 2023",
                },
              },
              scales: {
                y: {
                  type: "time",
                  time: {
                    unit: "month",
                    displayFormats: {
                      month: "dd MMM yyyy",
                    },
                  },
                  min: new Date("2023-01-01").getTime(),
                  max: new Date("2024-9-31").getTime(),
                  // step: 5,
                },
                x: {
                  ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 45,
                  },
                },
              },
            }}
            id="bar-chart"
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className="pie">
        <h3>Pie Chart (Popularity)</h3>
        {pieChartData.labels ? (
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Track Popularity",
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem, data) {
                      const dataset = data.datasets[tooltipItem.datasetIndex];
                      const currentValue = dataset.data[tooltipItem.index];
                      return `${dataset.label}: ${currentValue}`;
                    },
                  },
                },
              },
            }}
            id="pie-chart"
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className="line">
        <h3>Line chart (Track duration)</h3>
        {lineChartData.labels ? (
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Track Duration in 2023-2024",
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      return `${value} ms`;
                    },
                  },
                },
                x: {
                  ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 45,
                  },
                },
              },
            }}
            id="line-chart"
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}
