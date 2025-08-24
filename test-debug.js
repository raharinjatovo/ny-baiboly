// Test API with debug logs
async function testAPIWithLogs() {
  try {
    console.info('🔥 Testing API...');
    
    const response = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book: 'John',
        chapter: 3,
        verses: [16]
      })
    });
    
    console.info('🔥 Response status:', response.status);
    const data = await response.json();
    console.info('🔥 Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('🔥 Error:', error.message);
  }
}

testAPIWithLogs();
