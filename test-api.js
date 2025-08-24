// Test the Bible Reference Search API
const testAPI = async () => {
  try {
    console.info('Testing Bible Reference Search API...\n');
    
    // Test 1: Single verse
    console.info('Test 1: Single verse (John 3:16)');
    const response1 = await fetch('http://localhost:3000/api/search-reference', {
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
    
    const data1 = await response1.json();
    console.info('Response:', JSON.stringify(data1, null, 2));
    console.info('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Multiple verses
    console.info('Test 2: Multiple verses (Psalm 23:1,4,6)');
    const response2 = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book: 'Psalm',
        chapter: 23,
        verses: [1, 4, 6]
      })
    });
    
    const data2 = await response2.json();
    console.info('Response:', JSON.stringify(data2, null, 2));
    console.info('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Verse range
    console.info('Test 3: Verse range (Genesis 1:1-3)');
    const response3 = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book: 'Genesis',
        chapter: 1,
        verses: [{ start: 1, end: 3 }]
      })
    });
    
    const data3 = await response3.json();
    console.info('Response:', JSON.stringify(data3, null, 2));
    console.info('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Mixed format
    console.info('Test 4: Mixed format (Romans 8:1-3,28,35)');
    const response4 = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book: 'Romans',
        chapter: 8,
        verses: [{ start: 1, end: 3 }, 28, 35]
      })
    });
    
    const data4 = await response4.json();
    console.info('Response:', JSON.stringify(data4, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
};

testAPI();
