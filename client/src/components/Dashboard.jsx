import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAlerts();
  }, []);

  const fetchStats = async () => {
    try {
     
      const response = await axios.get(`https://favournetwork-app-production-d24d.up.railway.app/api/traffic/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      
      const response = await axios.get(`https://favournetwork-app-production-d24d.up.railway.app/api/alerts`);
      setAlerts(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-900 to-cyan-700 rounded-xl p-6 border border-cyan-500">
          <div className="text-cyan-300 text-sm font-medium">Total Packets</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalPackets}</div>
          <div className="text-cyan-200 text-xs mt-2">24h Analysis</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900 to-orange-700 rounded-xl p-6 border border-orange-500">
          <div className="text-orange-300 text-sm font-medium">Suspicious Activity</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.suspicious}</div>
          <div className="text-orange-200 text-xs mt-2">Requires Attention</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-xl p-6 border border-red-500">
          <div className="text-red-300 text-sm font-medium">Blocked Threats</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.blocked}</div>
          <div className="text-red-200 text-xs mt-2">Auto-prevented</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-6 border border-green-500">
          <div className="text-green-300 text-sm font-medium">System Status</div>
          <div className="text-3xl font-bold text-white mt-2">100%</div>
          <div className="text-green-200 text-xs mt-2">Operational</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Protocol Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.protocols).map(([protocol, count]) => (
              <div key={protocol} className="flex items-center justify-between">
                <span className="text-gray-300">{protocol}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalPackets) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Recent Security Alerts</h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-white font-medium">{alert.type}</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{alert.source_ip} → {alert.destination_ip}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-300 text-sm">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  <div className={`text-xs ${
                    alert.status === 'active' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {alert.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;