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
  
  // Audio references
  const alertSoundRef = useRef(null);
  const highSoundRef = useRef(null);
  const mediumSoundRef = useRef(null);
  const lowSoundRef = useRef(null);

  // Initialize audio files - using simple beep sounds
  useEffect(() => {
    // Create simple beep sounds programmatically
    createBeepSound('high', 800, 0.5);   // High pitch for high severity
    createBeepSound('medium', 600, 0.3); // Medium pitch for medium severity
    createBeepSound('low', 400, 0.2);    // Low pitch for low severity
    
    // Also create a simple alert sound
    alertSoundRef.current = new Audio(createBeepData(1000, 0.4));
    
    // Store sounds in refs
    highSoundRef.current = new Audio(createBeepData(800, 0.5));
    mediumSoundRef.current = new Audio(createBeepData(600, 0.3));
    lowSoundRef.current = new Audio(createBeepData(400, 0.2));
    
  }, []);

  // Function to create beep sound data
  const createBeepData = (frequency = 800, duration = 0.5) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    // Create a MediaStreamDestination to capture the audio
    const destination = audioContext.createMediaStreamDestination();
    oscillator.connect(destination);
    
    // Note: For actual playback, we'll use a different approach
    return null;
  };

  // Function to create and play beep sound
  const createBeepSound = (type, frequency, volume) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio context not supported, using fallback');
    }
  };

  // Function to play alert sound
  const playAlertSound = (severity) => {
    if (!soundEnabled || !hasUserInteracted) return;
    
    console.log(`Playing ${severity} alert sound`);
    
    switch(severity) {
      case 'high':
        // Create beep sound for high severity
        createBeepSound('high', 800, 0.5);
        setTimeout(() => createBeepSound('high', 800, 0.5), 300);
        setTimeout(() => createBeepSound('high', 800, 0.5), 600);
        break;
      case 'medium':
        createBeepSound('medium', 600, 0.3);
        setTimeout(() => createBeepSound('medium', 600, 0.3), 400);
        break;
      case 'low':
        createBeepSound('low', 400, 0.2);
        break;
      default:
        createBeepSound('low', 400, 0.2);
    }
  };

  // Record user interaction to enable audio
  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      console.log('User interaction recorded - audio enabled');
      
      // Play a test sound to warm up the audio context
      setTimeout(() => {
        createBeepSound('test', 300, 0.1);
      }, 100);
    }
  };

  // Test sound function - now requires user interaction
  const testSound = (severity = 'medium') => {
    if (!hasUserInteracted) {
      alert('Please click the "Test Sounds" buttons first to enable audio. Browsers require user interaction before playing sounds.');
      return;
    }
    playAlertSound(severity);
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
      
      // Play alert sound after a short delay
      setTimeout(() => {
        playAlertSound(newAlert.severity);
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
      
      // Play alert sound for local alerts too
      setTimeout(() => {
        playAlertSound(newAlert.severity);
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
      {/* Sound Controls Bar */}
      <div className="flex flex-wrap gap-3 justify-end">
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-300">Audio Status:</span>
          <div className={`px-3 py-1 rounded font-medium ${hasUserInteracted ? 'bg-green-600' : 'bg-yellow-600'}`}>
            {hasUserInteracted ? '✅ Ready' : '⏳ Click to Enable'}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-300">Alert Sounds:</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1 rounded font-medium ${soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {soundEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-300">Test Sounds:</span>
          <button
            onClick={() => testSound('low')}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded font-medium"
          >
            Test Low
          </button>
          <button
            onClick={() => testSound('medium')}
            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded font-medium"
          >
            Test Medium
          </button>
          <button
            onClick={() => testSound('high')}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded font-medium"
          >
            Test High
          </button>
        </div>
      </div>

      {/* Audio Instructions */}
      {!hasUserInteracted && (
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 animate-pulse">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-3 text-2xl">🔊</span>
            <div>
              <h4 className="text-yellow-300 font-medium">Audio Permission Required</h4>
              <p className="text-yellow-200 text-sm">
                Click anywhere on the page to enable alert sounds. Modern browsers require user interaction before playing audio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r from-red-900 to-orange-900 rounded-xl p-6 border ${activeAlerts.length > 0 ? 'border-red-400 animate-pulse' : 'border-red-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Security Alerts Dashboard</h2>
            <p className="text-red-200">Real-time threat monitoring and incident response</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white flex items-center">
              {activeAlerts.length}
              {activeAlerts.length > 0 && (
                <span className="ml-2 text-red-300 animate-ping">⚠️</span>
              )}
            </div>
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
            <div className="mb-4 p-3 bg-cyan-900 border border-cyan-700 rounded-lg">
              <p className="text-cyan-200 text-sm">
                <span className="font-bold">Note:</span> Alert will play a sound based on severity level
              </p>
              <p className="text-cyan-300 text-xs mt-1">
                {!hasUserInteracted ? '⚠️ Click page first to enable audio' : '✅ Audio ready - will play sound'}
              </p>
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
                  Severity
                </label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="low">Low (Single Beep)</option>
                  <option value="medium">Medium (Double Beep)</option>
                  <option value="high">High (Triple Beep)</option>
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
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>🚨</span>
                <span>Generate Alert with Sound</span>
              </button>
              
              <div className="text-xs text-gray-400 text-center">
                {soundEnabled 
                  ? `Audio: ${hasUserInteracted ? '✅ Ready' : '⏳ Requires click'}` 
                  : "⚠️ Alert sounds are disabled"}
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