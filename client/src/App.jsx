import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TrafficMonitor from './components/TrafficMonitor';
import AlertsPanel from './components/AlertsPanel';
import ThreatScanner from './components/ThreatScanner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'traffic', name: 'Network Traffic', icon: '🌐' },
    { id: 'scanner', name: 'Threat Scanner', icon: '🔍' },
    { id: 'alerts', name: 'Security Alerts', icon: '🚨' }
  ];

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Close mobile menu when clicking outside (optional)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-900 to-blue-900 border-b border-cyan-500 w-screen">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CyberShield IDS
                </h1>
                <p className="text-cyan-300 text-xs sm:text-sm">Network Intrusion Detection System</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-cyan-800 hover:bg-cyan-700 transition-colors"
              aria-label="Toggle menu"
            >
              <span className="text-white text-xl">
                {isMobileMenuOpen ? '✕' : '☰'}
              </span>
            </button>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-cyan-300">Status: <span className="text-green-400 font-bold">ACTIVE</span></div>
                <div className="text-xs text-gray-400">Real-time Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 lg:px-6 py-3 font-medium rounded-t-lg transition-all duration-200 flex items-center ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="py-4 space-y-2 border-t border-gray-700">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                      activeTab === tab.id
                        ? 'bg-cyan-900 text-cyan-400 border-l-4 border-cyan-400'
                        : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                    {activeTab === tab.id && (
                      <span className="ml-auto text-cyan-400">●</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Mobile Horizontal Scroll Navigation (when menu closed) */}
            {!isMobileMenuOpen && (
              <div className="flex space-x-1 overflow-x-auto py-3 scrollbar-hide -mx-2 px-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-4 py-2 font-medium rounded-lg transition-all duration-200 flex items-center ${
                      activeTab === tab.id
                        ? 'bg-cyan-900 text-cyan-400 border-2 border-cyan-400'
                        : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-700 border-2 border-transparent'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    <span className="text-sm whitespace-nowrap">{tab.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'traffic' && <TrafficMonitor />}
        {activeTab === 'scanner' && <ThreatScanner />}
        {activeTab === 'alerts' && <AlertsPanel alerts={alerts} setAlerts={setAlerts} />}
      </main>

      {/* Mobile Status Bar (Bottom) - Optional */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-cyan-300">System Active</span>
          </div>
          <div className="text-gray-400">
            {tabs.find(tab => tab.id === activeTab)?.icon} {tabs.find(tab => tab.id === activeTab)?.name}
          </div>
        </div>
      </div>

      {/* Add padding for mobile bottom bar */}
      <div className="md:hidden pb-16"></div>
    </div>
  );
}

export default App;