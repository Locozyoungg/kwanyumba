import { useEffect, useState } from "react";
import axios from "axios";

const FraudMonitoring = () => {
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);

  useEffect(() => {
    const fetchBlacklistedUsers = async () => {
      try {
        const response = await axios.get("/api/admin/blacklisted-users");
        setBlacklistedUsers(response.data);
      } catch (error) {
        console.error("Error fetching blacklisted users", error);
      }
    };

    fetchBlacklistedUsers();
  }, []);

  return (
    <div className="dashboard">
      <h1>Fraud Monitoring</h1>

      <h2>Blacklisted Users</h2>
      <ul>
        {blacklistedUsers.map((user, index) => (
          <li key={index}>
            User: {user.userId} - Reason: {user.reason} (Added on: {new Date(user.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FraudMonitoring;
