// Debug chapter access specifically
async function debugChapter() {
  try {
    console.info('Testing chapter access debug...');
    
    const response = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book: 'John',
        chapter: 1,  // Try chapter 1 first
        verses: [1]  // Try verse 1
      })
    });
    
    console.info('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.info('SUCCESS!');
      console.info('Response:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.info('ERROR Response:', JSON.stringify(errorData, null, 2));
    }
    
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

debugChapter();
