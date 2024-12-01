import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos.png";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title } from "chart.js";
import { getAuth, signOut } from 'firebase/auth'; // Add this import for Firebase auth


ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  LineElement, 
  BarElement, 
  PointElement, 
  Title
);

const UserDetails = () => {
  const [wasteData, setWasteData] = useState({
    plastic: [],
    metal: [],
    paper: [],
    can: [],
    glass: [],
    dates: [],
    biodegradable: 0,
    nonBiodegradable: 0,
    recyclable: 0,
    nonRecyclable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectedWaste = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "COLLECTED_WASTE"));
        const waste = querySnapshot.docs.map((doc) => doc.data());
        calculateWasteData(waste);
      } catch (error) {
        console.error("Error fetching collected waste:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectedWaste();
  }, []);

  const calculateWasteData = (waste) => {
    let plastic = [], metal = [], paper = [], can = [], glass = [], dates = [];
    let biodegradable = 0, nonBiodegradable = 0, recyclable = 0, nonRecyclable = 0;

    waste.forEach(item => {
      const wasteDate = item.date_created;
      dates.push(wasteDate);
      let plasticCount = 0, metalCount = 0, paperCount = 0, canCount = 0, glassCount = 0;

      item.waste.forEach(wasteType => {
        if (wasteType.name === "Plastic") plasticCount += wasteType.quantity;
        if (wasteType.name === "Metal") metalCount += wasteType.quantity;
        if (wasteType.name === "Paper") paperCount += wasteType.quantity;
        if (wasteType.name === "Can") canCount += wasteType.quantity;
        if (wasteType.name === "Glass") glassCount += wasteType.quantity;

        if (["Paper", "Glass", "Organic"].includes(wasteType.name)) {
          biodegradable += wasteType.quantity;
          recyclable += wasteType.name !== "Organic" ? wasteType.quantity : 0;
        } else {
          nonBiodegradable += wasteType.quantity;
          nonRecyclable += wasteType.name !== "Glass" && wasteType.name !== "Paper" ? wasteType.quantity : 0;
        }
      });

      plastic.push(plasticCount);
      metal.push(metalCount);
      paper.push(paperCount);
      can.push(canCount);
      glass.push(glassCount);
    });

    setWasteData({
      plastic,
      metal,
      paper,
      can,
      glass,
      dates,
      biodegradable,
      nonBiodegradable,
      recyclable,
      nonRecyclable,
    });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);

    const auth = getAuth();
    try {
      await signOut(auth);
      alert("You have been logged out.");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const lineChartData = {
    labels: wasteData.dates,
    datasets: [
      {
        label: "Plastic Waste",
        data: wasteData.plastic,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Metal Waste",
        data: wasteData.metal,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Paper Waste",
        data: wasteData.paper,
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Can Waste",
        data: wasteData.can,
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Glass Waste",
        data: wasteData.glass,
        borderColor: "#FF9F40",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const classificationData = {
    labels: ["Biodegradable", "Non-Biodegradable", "Recyclable", "Non-Recyclable"],
    datasets: [
      {
        label: "Waste Classification",
        data: [
          wasteData.biodegradable,
          wasteData.nonBiodegradable,
          wasteData.recyclable,
          wasteData.nonRecyclable,
        ],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Waste Collection Breakdown Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Waste Classification Report",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <aside className="bg-white w-64 p-6">
        <h1 className="text-2xl font-bold mb-8 flex items-center">
          <img src={logo} alt="Wast.ed Logo" className="w-8 h-8 mr-2" />
          Wast.ed
        </h1>
        <nav>
          <ul className="space-y-4">
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </li>
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => navigate("/users")}
            >
              Users
            </li>
            <li
              className="text-green-500 font-medium cursor-pointer"
              onClick={() => navigate("/user-details")}
            >
              Generate Reports
            </li>
            <li
              className="font-small hover:text-green-500 cursor-pointer"
              onClick={() => navigate("/create-qa")}
            >
              Create Q&A
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="underline text-3xl font-bold">REPORTS</h2>
          <div className="flex items-center space-x-4">
            <span>Admin</span>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Print Page
            </button>
            <button
              onClick={handleLogout}
              className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ${
                isLoggingOut ? "bg-gray-400" : ""
              }`}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </header>

        <div className="bg-white p-6 rounded shadow mb-8" style={{ width: "75%", height: "400px" }}>
          <h3 className="text-xl font-semibold mb-4">Waste Collection Breakdown Over Time</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Line data={lineChartData} options={lineChartOptions} height={300} width={600} />
          )}
        </div>

        <div className="bg-white p-6 rounded shadow mb-8" style={{ width: "75%", height: "400px" }}>
          <h3 className="text-xl font-semibold mb-4">Waste Classification Report</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Bar data={classificationData} options={barChartOptions} height={300} width={600} />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDetails;
