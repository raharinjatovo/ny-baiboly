// Debug the book loading
const testBookLoading = async () => {
  try {
    console.info('Testing book loading...\n');
    
    // Test loading John book directly
    const response = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book: 'John',
        chapter: 1,
        verses: [1]
      })
    });
    
    console.info('Status:', response.status);
    console.info('Headers:', Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.info('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testBookLoading();
