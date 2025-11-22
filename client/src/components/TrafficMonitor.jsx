import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrafficMonitor = () => {
  const [traffic, setTraffic] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTraffic();
  }, [currentPage]);

  const fetchTraffic = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/traffic?page=${currentPage}&limit=10`);
      setTraffic(response.data.traffic);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching traffic:', error);
      setError('Failed to load network traffic data');
      // Fallback to sample data
      setTraffic(getFallbackTraffic());
      setTotalPages(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data in case API fails completely
  const getFallbackTraffic = () => [
    {
      timestamp: '2024-01-15T08:30:00Z',
      source_ip: '192.168.1.10',
      destination_ip: '8.8.8.8',
      protocol: 'HTTPS',
      port: '443',
      packet_size: '1500',
      threat_level: 'low',
      status: 'allowed',
      description: 'Normal web traffic'
    },
    {
      timestamp: '2024-01-15T08:30:01Z',
      source_ip: '192.168.1.15',
      destination_ip: '10.0.0.50',
      protocol: 'SSH',
      port: '22',
      packet_size: '800',
      threat_level: 'medium',
      status: 'blocked',
      description: 'Suspicious login attempt'
    },
    {
      timestamp: '2024-01-15T08:30:02Z',
      source_ip: '192.168.1.20',
      destination_ip: '192.168.1.1',
      protocol: 'HTTP',
      port: '80',
      packet_size: '1200',
      threat_level: 'low',
      status: 'allowed',
      description: 'Internal web request'
    }
  ];

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-900';
      case 'medium': return 'text-orange-400 bg-orange-900';
      case 'low': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'blocked': return 'text-red-400';
      case 'allowed': return 'text-green-400';
      case 'investigating': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading network traffic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Network Traffic Monitor</h2>
        <button 
          onClick={fetchTraffic}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-400 mr-3">⚠️</span>
            <div>
              <h4 className="text-red-300 font-medium">Connection Issue</h4>
              <p className="text-red-200 text-sm">{error}</p>
              <p className="text-red-200 text-sm mt-1">Showing sample data for demonstration</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Source IP</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Destination IP</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Protocol</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Port</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Threat Level</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {traffic.map((packet, index) => (
                <tr key={index} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(packet.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-cyan-300">{packet.source_ip}</td>
                  <td className="px-6 py-4 text-sm font-mono text-blue-300">{packet.destination_ip}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{packet.protocol}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-300">{packet.port}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatLevelColor(packet.threat_level)}`}>
                      {packet.threat_level}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${getStatusColor(packet.status)}`}>
                    {packet.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TrafficMonitor;