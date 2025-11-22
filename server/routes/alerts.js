import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

let alerts = [
  {
    id: uuidv4(),
    type: 'DDoS',
    severity: 'high',
    source_ip: '192.168.1.100',
    destination_ip: '10.0.0.50',
    timestamp: new Date().toISOString(),
    description: 'Multiple SYN flood attempts detected',
    status: 'active'
  },
  {
    id: uuidv4(),
    type: 'Port Scan',
    severity: 'medium',
    source_ip: '192.168.1.150',
    destination_ip: '10.0.0.25',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    description: 'Rapid port scanning activity detected',
    status: 'investigating'
  }
];

router.get('/', (req, res) => {
  res.json(alerts);
});

router.post('/', (req, res) => {
  const alert = {
    id: uuidv4(),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  alerts.unshift(alert);
  res.json(alert);
});

router.put('/:id/resolve', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (alert) {
    alert.status = 'resolved';
    res.json(alert);
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

export default router;