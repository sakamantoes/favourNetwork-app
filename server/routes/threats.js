import express from 'express';

const router = express.Router();

const threatPatterns = [
  // SQL Injection Patterns
  { pattern: 'DROP TABLE', type: 'SQL Injection', severity: 'high' },
  { pattern: 'UNION SELECT', type: 'SQL Injection', severity: 'high' },
  { pattern: 'OR 1=1', type: 'SQL Injection', severity: 'high' },
  { pattern: '; --', type: 'SQL Injection', severity: 'high' },
  { pattern: 'EXEC xp_cmdshell', type: 'SQL Injection', severity: 'critical' },
  { pattern: 'SLEEP(', type: 'SQL Injection', severity: 'medium' },
  { pattern: 'BENCHMARK', type: 'SQL Injection', severity: 'medium' },
  { pattern: 'UPDATE users SET', type: 'SQL Injection', severity: 'high' },
  { pattern: 'INSERT INTO', type: 'SQL Injection', severity: 'high' },
  { pattern: 'SELECT * FROM', type: 'SQL Injection', severity: 'medium' },
  
  // XSS Patterns
  { pattern: '<script>', type: 'XSS Attack', severity: 'high' },
  { pattern: 'onerror=', type: 'XSS Attack', severity: 'high' },
  { pattern: 'onload=', type: 'XSS Attack', severity: 'high' },
  { pattern: 'onmouseover=', type: 'XSS Attack', severity: 'medium' },
  { pattern: 'javascript:', type: 'XSS Attack', severity: 'high' },
  { pattern: '<iframe', type: 'XSS Attack', severity: 'medium' },
  { pattern: '<svg', type: 'XSS Attack', severity: 'medium' },
  { pattern: '<body onload', type: 'XSS Attack', severity: 'high' },
  { pattern: 'alert(', type: 'XSS Attack', severity: 'low' },
  { pattern: 'eval(', type: 'XSS Attack', severity: 'high' },
  
  // Path Traversal
  { pattern: '../etc/passwd', type: 'Path Traversal', severity: 'high' },
  { pattern: '..\\windows', type: 'Path Traversal', severity: 'high' },
  { pattern: '/etc/passwd', type: 'Path Traversal', severity: 'high' },
  { pattern: '/etc/shadow', type: 'Path Traversal', severity: 'critical' },
  { pattern: 'C:\\Windows', type: 'Path Traversal', severity: 'medium' },
  { pattern: '/proc/self', type: 'Path Traversal', severity: 'medium' },
  { pattern: '%2e%2e%2f', type: 'Path Traversal', severity: 'high' },
  
  // Command Injection
  { pattern: '; ls', type: 'Command Injection', severity: 'high' },
  { pattern: '| cat', type: 'Command Injection', severity: 'high' },
  { pattern: '&& whoami', type: 'Command Injection', severity: 'high' },
  { pattern: '`id`', type: 'Command Injection', severity: 'high' },
  { pattern: '$(', type: 'Command Injection', severity: 'high' },
  { pattern: 'net user', type: 'Command Injection', severity: 'high' },
  { pattern: 'wget http', type: 'Command Injection', severity: 'medium' },
  { pattern: 'curl http', type: 'Command Injection', severity: 'medium' },
  { pattern: 'nc -lvp', type: 'Command Injection', severity: 'critical' },
  { pattern: 'rm -rf', type: 'Command Injection', severity: 'critical' },
  { pattern: 'system(', type: 'Command Injection', severity: 'high' },
  
  // Code Injection
  { pattern: '<?php', type: 'Code Injection', severity: 'high' },
  { pattern: '<?=', type: 'Code Injection', severity: 'high' },
  { pattern: '<%', type: 'Code Injection', severity: 'high' },
  { pattern: '${', type: 'Code Injection', severity: 'medium' },
  { pattern: '#{', type: 'Code Injection', severity: 'medium' },
  { pattern: '{{', type: 'Code Injection', severity: 'medium' },
  
  // LDAP Injection
  { pattern: '*)(', type: 'LDAP Injection', severity: 'high' },
  { pattern: '))(', type: 'LDAP Injection', severity: 'high' },
  
  // XXE Injection
  { pattern: '<!DOCTYPE', type: 'XXE Attack', severity: 'high' },
  { pattern: '<!ENTITY', type: 'XXE Attack', severity: 'high' },
  { pattern: 'SYSTEM \"file://', type: 'XXE Attack', severity: 'critical' },
  
  // SSRF Patterns
  { pattern: '169.254.169.254', type: 'SSRF Attack', severity: 'high' },
  { pattern: 'localhost:22', type: 'SSRF Attack', severity: 'medium' },
  { pattern: '127.0.0.1:', type: 'SSRF Attack', severity: 'medium' },
  { pattern: 'file:///', type: 'SSRF Attack', severity: 'high' },
  
  // JWT Tampering
  { pattern: 'eyJhbGciOiJub25l', type: 'JWT Tampering', severity: 'medium' },
  
  // NoSQL Injection
  { pattern: '"$where":', type: 'NoSQL Injection', severity: 'high' },
  { pattern: '"$ne":', type: 'NoSQL Injection', severity: 'medium' },
  { pattern: '"$regex":', type: 'NoSQL Injection', severity: 'medium' }
];

router.post('/scan', (req, res) => {
  const { payload } = req.body;
  const threats = [];
  
  threatPatterns.forEach(pattern => {
    if (payload.toLowerCase().includes(pattern.pattern.toLowerCase())) {
      threats.push({
        type: pattern.type,
        severity: pattern.severity,
        pattern: pattern.pattern,
        position: payload.toLowerCase().indexOf(pattern.pattern.toLowerCase())
      });
    }
  });
  
  res.json({
    isThreat: threats.length > 0,
    threats,
    scannedAt: new Date().toISOString()
  });
});

export default router;