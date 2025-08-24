// Test English book name mapping
const testBookMapping = async () => {
  try {
    console.info('Testing book mapping...\n');
    
    // Test the mapping endpoint
    const response = await fetch('http://localhost:3000/api/search-reference', {
      method: 'GET'
    });
    
    const data = await response.json();
    console.info('API Documentation:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testBookMapping();
