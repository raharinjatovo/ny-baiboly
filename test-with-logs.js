// Test API with logging
const https = require('https');
const http = require('http');

const postData = JSON.stringify({
  book: 'John',
  chapter: 3,
  verses: [16]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/search-reference',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.info('Sending request with data:', postData);

const req = http.request(options, (res) => {
  console.info(`statusCode: ${res.statusCode}`);
  console.info(`headers:`, res.headers);

  res.on('data', (d) => {
    console.info('Response:', d.toString());
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(postData);
req.end();
