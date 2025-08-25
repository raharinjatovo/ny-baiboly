// Test script to verify search testament functionality
const testSearch = async () => {
  console.log('Testing search API testament functionality...\n');
  
  try {
    // Test 1: No testament parameter (should search all)
    console.log('1. Testing without testament parameter:');
    const response1 = await fetch('http://localhost:3000/api/search?q=Andriamanitra&limit=5');
    const data1 = await response1.json();
    
    if (data1.success) {
      console.log(`Found ${data1.data.length} results`);
      const oldCount = data1.data.filter(v => v.book.testament === 'Testameta taloha').length;
      const newCount = data1.data.filter(v => v.book.testament === 'Testameta vaovao').length;
      console.log(`  Old Testament: ${oldCount}, New Testament: ${newCount}`);
      
      // Show examples
      data1.data.forEach((verse, index) => {
        console.log(`  ${index + 1}. ${verse.book.name} (${verse.book.testament}) ${verse.chapter}:${verse.verse}`);
      });
    } else {
      console.log('Error:', data1.error);
    }
    
    console.log('\n2. Testing with OLD testament:');
    const response2 = await fetch('http://localhost:3000/api/search?q=Andriamanitra&testament=old&limit=3');
    const data2 = await response2.json();
    
    if (data2.success) {
      console.log(`Found ${data2.data.length} results (should be Old Testament only)`);
      data2.data.forEach((verse, index) => {
        console.log(`  ${index + 1}. ${verse.book.name} (${verse.book.testament}) ${verse.chapter}:${verse.verse}`);
      });
    } else {
      console.log('Error:', data2.error);
    }
    
    console.log('\n3. Testing with NEW testament:');
    const response3 = await fetch('http://localhost:3000/api/search?q=Andriamanitra&testament=new&limit=3');
    const data3 = await response3.json();
    
    if (data3.success) {
      console.log(`Found ${data3.data.length} results (should be New Testament only)`);
      data3.data.forEach((verse, index) => {
        console.log(`  ${index + 1}. ${verse.book.name} (${verse.book.testament}) ${verse.chapter}:${verse.verse}`);
      });
    } else {
      console.log('Error:', data3.error);
    }
    
    // Test 4: POST API test with no testament
    console.log('\n4. Testing POST API without testament:');
    const response4 = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'Andriamanitra',
        options: {
          limit: 3
        }
      })
    });
    const data4 = await response4.json();
    
    if (data4.success) {
      console.log(`Found ${data4.data.length} results (should include both testaments)`);
      const oldCount4 = data4.data.filter(v => v.book.testament === 'Testameta taloha').length;
      const newCount4 = data4.data.filter(v => v.book.testament === 'Testameta vaovao').length;
      console.log(`  Old Testament: ${oldCount4}, New Testament: ${newCount4}`);
      data4.data.forEach((verse, index) => {
        console.log(`  ${index + 1}. ${verse.book.name} (${verse.book.testament}) ${verse.chapter}:${verse.verse}`);
      });
    } else {
      console.log('Error:', data4.error);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Run the test
const runTest = async () => {
  // Import fetch for Node.js if needed
  if (typeof fetch === 'undefined') {
    try {
      const { default: fetch } = await import('node-fetch');
      global.fetch = fetch;
    } catch (error) {
      console.error('Please install node-fetch: npm install node-fetch');
      console.error('Or run this in a browser environment');
      return;
    }
  }
  
  await testSearch();
};

runTest();
