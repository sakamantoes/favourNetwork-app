import express from 'express';
import { readFileSync } from 'fs';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fallback sample data
const getSampleTraffic = () => [
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
  },
  {
    timestamp: '2024-01-15T08:30:03Z',
    source_ip: '192.168.1.100',
    destination_ip: '10.0.0.25',
    protocol: 'FTP',
    port: '21',
    packet_size: '600',
    threat_level: 'high',
    status: 'blocked',
    description: 'Brute force attempt'
  },
  {
    timestamp: '2024-01-15T08:30:04Z',
    source_ip: '192.168.1.30',
    destination_ip: '1.1.1.1',
    protocol: 'HTTPS',
    port: '443',
    packet_size: '1400',
    threat_level: 'low',
    status: 'allowed',
    description: 'DNS over HTTPS'
  },
  {
    timestamp: '2024-01-15T08:30:05Z',
    source_ip: '192.168.1.200',
    destination_ip: '10.0.0.100',
    protocol: 'SSH',
    port: '22',
    packet_size: '900',
    threat_level: 'high',
    status: 'blocked',
    description: 'Port scanning'
  },
  {
    timestamp: '2024-01-15T08:30:06Z',
    source_ip: '192.168.1.25',
    destination_ip: '8.8.4.4',
    protocol: 'HTTP',
    port: '80',
    packet_size: '1100',
    threat_level: 'low',
    status: 'allowed',
    description: 'Normal web traffic'
  },
  {
    timestamp: '2024-01-15T08:30:07Z',
    source_ip: '192.168.1.150',
    destination_ip: '10.0.0.75',
    protocol: 'FTP',
    port: '21',
    packet_size: '750',
    threat_level: 'medium',
    status: 'investigating',
    description: 'Multiple failed logins'
  },
  {
    timestamp: '2024-01-15T08:30:08Z',
    source_ip: '192.168.1.45',
    destination_ip: '10.0.0.200',
    protocol: 'HTTP',
    port: '8080',
    packet_size: '2000',
    threat_level: 'low',
    status: 'allowed',
    description: 'API request'
  },
  {
    timestamp: '2024-01-15T08:30:09Z',
    source_ip: '203.0.113.15',
    destination_ip: '10.0.0.50',
    protocol: 'SSH',
    port: '22',
    packet_size: '850',
    threat_level: 'high',
    status: 'blocked',
    description: 'Known malicious IP'
  }
];

let networkTraffic = [];

// Simple CSV parser function
const parseCSV = (csvString) => {
  const lines = csvString.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
};

// Try to load CSV, fallback to sample data
try {
  const csvPath = join(__dirname, '../data/network_traffic.csv');
  const csvData = readFileSync(csvPath, 'utf8');
  networkTraffic = parseCSV(csvData);
  console.log('✅ CSV data loaded successfully');
} catch (error) {
  console.log('⚠️ CSV file not found, using sample data');
  networkTraffic = getSampleTraffic();
}

router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    
    const traffic = networkTraffic.slice(startIndex, startIndex + limit);
    
    res.json({
      traffic,
      totalPages: Math.ceil(networkTraffic.length / limit),
      currentPage: page,
      totalRecords: networkTraffic.length
    });
  } catch (error) {
    console.error('Error in traffic route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalPackets: networkTraffic.length,
      suspicious: networkTraffic.filter(t => t.threat_level !== 'low').length,
      blocked: networkTraffic.filter(t => t.status === 'blocked').length,
      protocols: {
        HTTP: networkTraffic.filter(t => t.protocol === 'HTTP').length,
        HTTPS: networkTraffic.filter(t => t.protocol === 'HTTPS').length,
        FTP: networkTraffic.filter(t => t.protocol === 'FTP').length,
        SSH: networkTraffic.filter(t => t.protocol === 'SSH').length
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error in stats route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;