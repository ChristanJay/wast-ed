import React, { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; 
import { getAuth, signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom"; 
import logo from "../assets/logos.png"; 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId)); 
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle Log Out
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    setIsLoggingOut(true); // Set the logout state to true

    const auth = getAuth();
    try {
      await signOut(auth); // Log out the user
      alert("You have been logged out.");
      navigate("/"); // Redirect to the Hero page (or homepage)
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false); // Reset the logout state
    }
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
              className="text-green-500 font-medium cursor-pointer"
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

      <main className="flex-1 p-8">

        <header className="flex justify-between items-center mb-8">
          <h2 className="underline text-3xl font-bold">USERS</h2>
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

        {/* User Table */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">All Users</h3>
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2">Profile</th>
                  <th className="border-b py-2">Name</th>
                  <th className="border-b py-2">Email</th>
                  <th className="border-b py-2">Phone</th>
                  <th className="border-b py-2">Address</th>
                  <th className="border-b py-2">Actions</th> {/* Add Actions column */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2">
                      <img
                        src={user.profileImageUrl || "https://via.placeholder.com/40"}
                        alt={user.displayName || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="py-2">{user.displayName || "Unknown User"}</td>
                    <td className="py-2">{user.email || "No email"}</td>
                    <td className="py-2">{user.phoneNumber || "No phone number"}</td>
                    <td className="py-2">{user.address || "No address"}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(user.id)} // Use the correct document ID
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </td>
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

export default Users;
