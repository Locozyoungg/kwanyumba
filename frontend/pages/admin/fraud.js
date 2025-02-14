import { useEffect, useState } from "react";
import axios from "axios";

const FraudDashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/admin/fraud-logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Error fetching fraud logs", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="dashboard">
      <h1>Fraud Monitoring</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Reason</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.userId}</td>
              <td>{log.reason}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FraudDashboard;
