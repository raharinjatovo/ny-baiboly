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

console.info('🔥 Sending request...');

const req = http.request(options, (res) => {
  console.info(`🔥 Status: ${res.statusCode}`);
  console.info(`🔥 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.info('🔥 Response:', data);
  });
});

req.on('error', (error) => {
  console.error('🔥 Request error:', error);
});

req.write(postData);
req.end();
