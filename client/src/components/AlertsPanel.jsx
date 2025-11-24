import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAlert, setNewAlert] = useState({
    type: '',
    severity: 'medium',
    source_ip: '',
    destination_ip: '',
    description: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
       const API_URL = "https://favournetwork-app-production-d24d.up.railway.app/"
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Fallback to sample data if backend is not available
      setAlerts(getSampleAlerts());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleAlerts = () => [
    {
      id: '1',
      type: 'DDoS Attack',
      severity: 'high',
      source_ip: '192.168.1.100',
      destination_ip: '10.0.0.50',
      timestamp: new Date().toISOString(),
      description: 'Multiple SYN flood attempts detected from suspicious IP range',
      status: 'active'
    },
    {
      id: '2',
      type: 'Port Scanning',
      severity: 'medium',
      source_ip: '192.168.1.150',
      destination_ip: '10.0.0.25',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      description: 'Rapid port scanning activity on multiple services',
      status: 'investigating'
    },
    {
      id: '3',
      type: 'Brute Force',
      severity: 'high',
      source_ip: '192.168.1.200',
      destination_ip: '10.0.0.75',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      description: 'Multiple failed SSH login attempts detected',
      status: 'resolved'
    },
    {
      id: '4',
      type: 'SQL Injection',
      severity: 'high',
      source_ip: '192.168.1.50',
      destination_ip: '10.0.0.100',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      description: 'SQL injection attempt on web application form',
      status: 'active'
    },
    {
      id: '5',
      type: 'Malware Beacon',
      severity: 'medium',
      source_ip: '192.168.1.75',
      destination_ip: '8.8.8.8',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      description: 'Suspicious DNS queries to known malicious domains',
      status: 'investigating'
    }
  ];

  const resolveAlert = async (alertId) => {
  
    try {
      await axios.put(`https://favournetwork-app-production-d24d.up.railway.app/api/alerts/${alertId}/resolve`);
      // Update local state
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
    } catch (error) {
      console.error('Error resolving alert:', error);
      // Update locally if backend fails
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
    }
  };

  const createAlert = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://favournetwork-app-production-d24d.up.railway.app/api/alerts`, newAlert);
      setAlerts([response.data, ...alerts]);
      setNewAlert({
        type: '',
        severity: 'medium',
        source_ip: '',
        destination_ip: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      // Create locally if backend fails
      const localAlert = {
        id: Date.now().toString(),
        ...newAlert,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      setAlerts([localAlert, ...alerts]);
      setNewAlert({
        type: '',
        severity: 'medium',
        source_ip: '',
        destination_ip: '',
        description: ''
      });
    }
  };

  const deleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-yellow-500 text-gray-900';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-400 border-red-400';
      case 'investigating': return 'text-orange-400 border-orange-400';
      case 'resolved': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🔴';
      case 'investigating': return '🟡';
      case 'resolved': return '🟢';
      default: return '⚪';
    }
  };

  const alertTypes = [
    'DDoS Attack',
    'Port Scanning',
    'Brute Force',
    'SQL Injection',
    'XSS Attack',
    'Malware Beacon',
    'Data Exfiltration',
    'Unauthorized Access',
    'Policy Violation',
    'Suspicious Activity'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading security alerts...</p>
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.status !== 'resolved');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-xl p-6 border border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Security Alerts Dashboard</h2>
            <p className="text-red-200">Real-time threat monitoring and incident response</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{activeAlerts.length}</div>
            <div className="text-red-300 text-sm">Active Threats</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Statistics */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create New Alert Form */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Create Test Alert</h3>
            <form onSubmit={createAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alert Type
                </label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  required
                >
                  <option value="">Select alert type</option>
                  {alertTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Severity
                </label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source IP
                  </label>
                  <input
                    type="text"
                    value={newAlert.source_ip}
                    onChange={(e) => setNewAlert({...newAlert, source_ip: e.target.value})}
                    placeholder="192.168.1.100"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination IP
                  </label>
                  <input
                    type="text"
                    value={newAlert.destination_ip}
                    onChange={(e) => setNewAlert({...newAlert, destination_ip: e.target.value})}
                    placeholder="10.0.0.50"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  placeholder="Describe the security incident..."
                  rows="3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg font-medium transition-colors"
              >
                Generate Alert
              </button>
            </form>
          </div>

          {/* Alert Statistics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Alert Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Alerts</span>
                <span className="text-white font-bold">{alerts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-400">High Severity</span>
                <span className="text-white font-bold">
                  {alerts.filter(a => a.severity === 'high').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-orange-400">Medium Severity</span>
                <span className="text-white font-bold">
                  {alerts.filter(a => a.severity === 'medium').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-400">Resolved</span>
                <span className="text-white font-bold">{resolvedAlerts.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Alerts */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white flex items-center">
                <span className="text-red-400 mr-2">🚨</span>
                Active Security Alerts
                <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                  {activeAlerts.length}
                </span>
              </h3>
            </div>
            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              {activeAlerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">✅</div>
                  <p>No active security alerts</p>
                  <p className="text-sm mt-2">All systems are secure</p>
                </div>
              ) : (
                activeAlerts.map(alert => (
                  <div key={alert.id} className="p-4 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className={`text-xs border px-2 py-1 rounded ${getStatusColor(alert.status)}`}>
                          {getStatusIcon(alert.status)} {alert.status}
                        </span>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <h4 className="font-bold text-white text-lg">{alert.type}</h4>
                      <p className="text-gray-300 text-sm mt-1">{alert.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-mono text-cyan-300">
                        {alert.source_ip} → {alert.destination_ip}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resolved Alerts */}
          {resolvedAlerts.length > 0 && (
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Resolved Alerts
                  <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                    {resolvedAlerts.length}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-gray-700 max-h-64 overflow-y-auto">
                {resolvedAlerts.map(alert => (
                  <div key={alert.id} className="p-4 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-green-400 text-xs border border-green-400 px-2 py-1 rounded">
                          ✅ RESOLVED
                        </span>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-300">{alert.type}</h4>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{alert.description}</p>
                    </div>
                    
                    <div className="font-mono text-gray-400 text-xs">
                      {alert.source_ip} → {alert.destination_ip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;