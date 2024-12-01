import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos.png";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [historyPickups, setHistoryPickups] = useState([]);
  const [recentJunkshopUsers, setRecentJunkshopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            navigate("/login");
          }
        });

        const fetchData = async () => {
          setLoading(true);
          await Promise.all([fetchUserCount(), fetchHistoryPickups(), fetchRecentJunkshopUsers()]);
          setLoading(false);
        };

        fetchData();

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, [navigate]);

  const fetchUserCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUserCount(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchHistoryPickups = async () => {
    try {
      const pickupsSnapshot = await getDocs(collection(db, "pickups"));
      const pickups = pickupsSnapshot.docs.map((doc) => doc.data());

      const pickupRequestsSnapshot = await getDocs(collection(db, "COLLECTED_WASTE"));
      const pickupRequests = pickupRequestsSnapshot.docs.map((doc) => doc.data());

      const allPickups = [...pickups, ...pickupRequests];
      setHistoryPickups(allPickups);
    } catch (error) {
      console.error("Error fetching history pickups:", error);
    }
  };

  const fetchRecentJunkshopUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "junkshopuser"));
      const junkshopUsers = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.accountCreated instanceof Timestamp) {
          data.accountCreated = data.accountCreated.toDate().toLocaleString();
        }
        return data;
      });
      setRecentJunkshopUsers(junkshopUsers.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent junkshop users:", error);
    }
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

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="bg-white w-64 p-6">
        <h1 className="text-2xl font-bold mb-8 flex items-center">
          <img src={logo} alt="Wast.ed Logo" className="w-8 h-8 mr-2" />
          Wast.ed
        </h1>
        <nav>
          <ul className="space-y-4">
            <li
              className="text-green-500 font-medium cursor-pointer"
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
              className="font-small hover:text-green-500 cursor-pointer"
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="underline text-3xl font-bold">DASHBOARD</h2>
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

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">All Users</h3>
            {loading ? <p>Loading...</p> : <p className="text-2xl">{userCount} Users</p>}
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">History Pickups</h3>
            {loading ? (
              <p>Loading...</p>
            ) : historyPickups.length === 0 ? (
              <p>No pickups found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">Name</th>
                    <th className="border-b py-2">Address</th>
                    <th className="border-b py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyPickups.map((pickup, index) => (
                    <tr key={index}>
                      <td className="py-2">{pickup.fullName || "N/A"}</td>
                      <td className="py-2">{pickup.address || "N/A"}</td>
                      <td
                        className={`py-2 ${
                          pickup.status === "Completed"
                            ? "text-green-500"
                            : pickup.status === "Pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {pickup.status || "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Junkshop Users</h3>
          {loading ? (
            <p>Loading...</p>
          ) : recentJunkshopUsers.length === 0 ? (
            <p>No recent junkshop users found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2">Profile</th>
                  <th className="border-b py-2">Junkshop Name</th>
                  <th className="border-b py-2">Phone Number</th>
                  <th className="border-b py-2">Waste Type</th>
                  <th className="border-b py-2">Account Created</th>
                </tr>
              </thead>
              <tbody>
                {recentJunkshopUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="py-2">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-2">{user.junkshopName || "N/A"}</td>
                    <td className="py-2">{user.phoneNumber || "N/A"}</td>
                    <td className="py-2">{user.wasteType || "N/A"}</td>
                    <td className="py-2">{user.accountCreated || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
