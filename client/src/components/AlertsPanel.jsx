import React, { useState, useEffect, useRef } from 'react';
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Audio references for siren sounds
  const ambulanceSoundRef = useRef(null);
  const policeSoundRef = useRef(null);
  const alertSoundRef = useRef(null);

  // Initialize real siren sounds (from free sound libraries)
  useEffect(() => {
    // Ambulance/emergency siren sound
    ambulanceSoundRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-alarm-905.mp3");
    
    // Police siren sound
    policeSoundRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3");
    
    // General alert sound
    alertSoundRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-security-brief-alarm-1001.mp3");
    
    // Set volumes
    ambulanceSoundRef.current.volume = 0.4;
    policeSoundRef.current.volume = 0.4;
    alertSoundRef.current.volume = 0.4;
    
    // Preload sounds
    ambulanceSoundRef.current.load();
    policeSoundRef.current.load();
    alertSoundRef.current.load();
    
  }, []);

  // Function to play ambulance siren sound
  const playAmbulanceSiren = () => {
    if (!ambulanceSoundRef.current || !soundEnabled || !hasUserInteracted) return;
    
    try {
      ambulanceSoundRef.current.currentTime = 0;
      ambulanceSoundRef.current.play();
      
      // Stop after 3 seconds
      setTimeout(() => {
        if (ambulanceSoundRef.current) {
          ambulanceSoundRef.current.pause();
          ambulanceSoundRef.current.currentTime = 0;
        }
      }, 3000);
    } catch (error) {
      console.log('Error playing siren sound:', error);
    }
  };

  // Function to play police siren sound
  const playPoliceSiren = () => {
    if (!policeSoundRef.current || !soundEnabled || !hasUserInteracted) return;
    
    try {
      policeSoundRef.current.currentTime = 0;
      policeSoundRef.current.play();
      
      // Stop after 3 seconds
      setTimeout(() => {
        if (policeSoundRef.current) {
          policeSoundRef.current.pause();
          policeSoundRef.current.currentTime = 0;
        }
      }, 3000);
    } catch (error) {
      console.log('Error playing siren sound:', error);
    }
  };

  // Function to play alert sound
  const playAlertSound = () => {
    if (!alertSoundRef.current || !soundEnabled || !hasUserInteracted) return;
    
    try {
      alertSoundRef.current.currentTime = 0;
      alertSoundRef.current.play();
      
      // Stop after 2 seconds
      setTimeout(() => {
        if (alertSoundRef.current) {
          alertSoundRef.current.pause();
          alertSoundRef.current.currentTime = 0;
        }
      }, 2000);
    } catch (error) {
      console.log('Error playing alert sound:', error);
    }
  };

  // Play appropriate sound based on severity
  const playAlertSoundBySeverity = (severity) => {
    if (!soundEnabled || !hasUserInteracted) return;
    
    switch(severity) {
      case 'high':
        playPoliceSiren(); // Police siren for high severity
        break;
      case 'medium':
        playAmbulanceSiren(); // Ambulance siren for medium severity
        break;
      case 'low':
        playAlertSound(); // General alert for low severity
        break;
      default:
        playAlertSound();
    }
  };

  // Record user interaction to enable audio
  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      console.log('User interaction recorded - audio enabled');
    }
  };

  // Test sound functions
  const testAmbulanceSound = () => {
    if (!hasUserInteracted) {
      alert('Please click the page first to enable audio. Browsers require user interaction before playing sounds.');
      return;
    }
    playAmbulanceSiren();
  };

  const testPoliceSound = () => {
    if (!hasUserInteracted) {
      alert('Please click the page first to enable audio. Browsers require user interaction before playing sounds.');
      return;
    }
    playPoliceSiren();
  };

  const testAlertSound = () => {
    if (!hasUserInteracted) {
      alert('Please click the page first to enable audio. Browsers require user interaction before playing sounds.');
      return;
    }
    playAlertSound();
  };

  useEffect(() => {
    fetchAlerts();
    
    // Add click event listener to document to detect user interaction
    const handleClick = () => {
      handleUserInteraction();
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const fetchAlerts = async () => {
    try {
      const API_URL = "https://favournetwork-app-production-d24d.up.railway.app/";
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
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
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
    } catch (error) {
      console.error('Error resolving alert:', error);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
    }
  };

  const createAlert = async (e) => {
    e.preventDefault();
    
    // Record user interaction
    handleUserInteraction();
    
    try {
      const response = await axios.post(`https://favournetwork-app-production-d24d.up.railway.app/api/alerts`, newAlert);
      setAlerts([response.data, ...alerts]);
      
      // Play appropriate siren sound
      setTimeout(() => {
        playAlertSoundBySeverity(newAlert.severity);
      }, 300);
      
      setNewAlert({
        type: '',
        severity: 'medium',
        source_ip: '',
        destination_ip: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      const localAlert = {
        id: Date.now().toString(),
        ...newAlert,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      setAlerts([localAlert, ...alerts]);
      
      // Play appropriate siren sound for local alerts too
      setTimeout(() => {
        playAlertSoundBySeverity(newAlert.severity);
      }, 300);
      
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
      {/* Siren Sound Controls */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Siren Sounds:</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                  soundEnabled 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <span>{soundEnabled ? '🔊' : '🔇'}</span>
                <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
            
            {!hasUserInteracted && (
              <div className="flex items-center space-x-2 bg-yellow-900 px-3 py-1 rounded">
                <span className="text-yellow-400">⚠️</span>
                <span className="text-yellow-300 text-sm">Click page to enable audio</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={testAmbulanceSound}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-medium flex items-center space-x-2"
            >
              <span>🚑</span>
              <span>Test Ambulance Siren</span>
            </button>
            <button
              onClick={testPoliceSound}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg font-medium flex items-center space-x-2"
            >
              <span>🚓</span>
              <span>Test Police Siren</span>
            </button>
            <button
              onClick={testAlertSound}
              className="px-4 py-2 bg-orange-700 hover:bg-orange-600 rounded-lg font-medium flex items-center space-x-2"
            >
              <span>⚠️</span>
              <span>Test Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r from-red-900 to-orange-900 rounded-xl p-6 border ${activeAlerts.length > 0 ? 'border-red-400 animate-pulse' : 'border-red-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Security Alerts Dashboard</h2>
            <p className="text-red-200">Real-time threat monitoring with emergency sirens</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white flex items-center">
              {activeAlerts.length}
              {activeAlerts.length > 0 && (
                <span className="ml-2 text-red-300 animate-ping">🚨</span>
              )}
            </div>
            <div className="text-red-300 text-sm">Active Threats</div>
            {activeAlerts.length > 0 && (
              <div className="text-xs text-red-400 mt-1">
                Emergency sirens will sound for new alerts
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Statistics */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create New Alert Form */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Create Test Alert</h3>
            
            <div className="mb-4 p-3 bg-cyan-900 border border-cyan-700 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-cyan-400 text-lg">🔊</span>
                <div>
                  <p className="text-cyan-200 text-sm font-medium">Emergency Siren Sounds:</p>
                  <div className="text-cyan-300 text-xs mt-1 space-y-1">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span>High Severity: Police Siren 🚓</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      <span>Medium Severity: Ambulance Siren 🚑</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      <span>Low Severity: General Alert ⚠️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
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
                  Severity (Select to hear siren)
                </label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => {
                    setNewAlert({...newAlert, severity: e.target.value});
                    // Play preview sound when severity changes
                    if (hasUserInteracted && soundEnabled) {
                      setTimeout(() => {
                        playAlertSoundBySeverity(e.target.value);
                      }, 100);
                    }
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="low">🟡 Low (General Alert)</option>
                  <option value="medium">🟠 Medium (Ambulance Siren)</option>
                  <option value="high">🔴 High (Police Siren)</option>
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
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 relative overflow-hidden"
              >
                <span className="relative z-10">🚨</span>
                <span className="relative z-10">Generate Alert with Siren</span>
                {soundEnabled && hasUserInteracted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-75 animate-pulse"></div>
                )}
              </button>
              
              <div className="text-xs text-gray-400 text-center pt-2">
                {soundEnabled 
                  ? `Audio: ${hasUserInteracted ? '✅ Sirens Ready' : '⏳ Click page to enable'}`
                  : "🔇 Sirens Disabled"}
              </div>
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
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-red-400">Police Siren Alerts</span>
                </div>
                <span className="text-white font-bold">
                  {alerts.filter(a => a.severity === 'high').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  <span className="text-orange-400">Ambulance Siren Alerts</span>
                </div>
                <span className="text-white font-bold">
                  {alerts.filter(a => a.severity === 'medium').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-green-400">Resolved Alerts</span>
                </div>
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <span className="text-red-400 mr-2">🚨</span>
                  Active Security Alerts
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    {activeAlerts.length}
                  </span>
                </h3>
                {activeAlerts.length > 0 && (
                  <div className="text-xs text-red-400 animate-pulse flex items-center">
                    <span className="mr-2">⚠️</span>
                    Sirens Active
                  </div>
                )}
              </div>
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
                          {alert.severity === 'high' ? '🚓 POLICE' : 
                           alert.severity === 'medium' ? '🚑 AMBULANCE' : '⚠️ ALERT'}
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
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors flex items-center"
                        >
                          <span className="mr-1">✅</span>
                          Resolve
                        </button>
                        <button
                          onClick={() => {
                            deleteAlert(alert.id);
                            // Play sound when deleting alert
                            if (hasUserInteracted && soundEnabled) {
                              playAlertSound();
                            }
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors flex items-center"
                        >
                          <span className="mr-1">🗑️</span>
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            // Replay the siren sound for this alert
                            if (hasUserInteracted && soundEnabled) {
                              playAlertSoundBySeverity(alert.severity);
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors flex items-center"
                        >
                          <span className="mr-1">🔊</span>
                          Play Siren
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