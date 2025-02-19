import { useEffect, useState } from "react";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [retentionData, setRetentionData] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const [searchTrends, setSearchTrends] = useState([]);
  const [locations, setLocations] = useState([]);
  const [peakTimes, setPeakTimes] = useState([]);
  const [earnings, setEarnings] = useState({ total_earnings: 0, total_payouts: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [traffic, retention, conversion, trends, locRes, timeRes, earningsRes] = await Promise.all([
          axios.get("/api/analytics/high-traffic"),
          axios.get("/api/analytics/user-retention"),
          axios.get("/api/analytics/conversion-rate"),
          axios.get("/api/analytics/search-trends"),
          axios.get("/api/admin/analytics/locations"),
          axios.get("/api/admin/analytics/peak-times"),
          axios.get("/api/admin/earnings"),
        ]);

        setTrafficData(traffic.data);
        setRetentionData(retention.data);
        setConversionData(conversion.data);
        setSearchTrends(trends.data);
        setLocations(locRes.data);
        setPeakTimes(timeRes.data);
        setEarnings(earningsRes.data);
      } catch (error) {
        console.error("Error fetching analytics data", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="dashboard">
      <h1>Business Insights</h1>
      
      <h2>High Traffic Areas</h2>
      <ul>
        {trafficData.map((item, index) => (
          <li key={index}>{item._id} - {item.count} searches</li>
        ))}
      </ul>

      <h2>User Retention</h2>
      {retentionData && (
        <p>Retention Rate: {Math.round(retentionData.retentionRate * 100)}% (Repeat Users: {retentionData.repeatUsers})</p>
      )}

      <h2>Conversion Rate</h2>
      {conversionData && (
        <p>Conversion Rate: {Math.round(conversionData.conversionRate)}% ({conversionData.bookings} bookings from {conversionData.searches} searches)</p>
      )}

      <h2>Search Trends Over Time</h2>
      <ul>
        {searchTrends.map((trend, index) => (
          <li key={index}>Month {trend._id}: {trend.count} searches</li>
        ))}
      </ul>

      <h2>Most Booked Locations</h2>
      <ul>
        {locations.map((loc, index) => (
          <li key={index}>{loc._id} - {loc.count} bookings</li>
        ))}
      </ul>

      <h2>Peak Booking Hours</h2>
      <ul>
        {peakTimes.map((time, index) => (
          <li key={index}>{time._id}:00 - {time.count} bookings</li>
        ))}
      </ul>

      <h2>Admin Earnings</h2>
      <p>Total Commission: KES {earnings.total_earnings}</p>
      <p>Total Payouts to Hosts: KES {earnings.total_payouts}</p>
    </div>
  );
};

export default AnalyticsDashboard;
