// Simple API test
async function testAPI() {
  try {
    console.info('Testing API with John 3:16...');
    
    const response = await fetch('http://localhost:3001/api/search-reference', {
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
    
    console.info('Status:', response.status);
    console.info('Status Text:', response.statusText);
    
    const data = await response.json();
    console.info('Response Data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
