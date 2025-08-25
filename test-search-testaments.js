// Test to verify search testament functionality
const { searchBible } = require('./src/lib/bible-data.ts');

async function testSearchTestaments() {
  console.log('Testing search testament functionality...\n');
  
  try {
    // Test 1: Search without testament (should search all)
    console.log('1. Testing search without testament parameter:');
    const allTestaments = await searchBible('Andriamanitra', { limit: 10 });
    console.log('Results:', allTestaments.success ? `${allTestaments.data.length} verses found` : allTestaments.error);
    
    if (allTestaments.success && allTestaments.data.length > 0) {
      const oldTestamentResults = allTestaments.data.filter(v => v.book.testament === 'Testameta taloha');
      const newTestamentResults = allTestaments.data.filter(v => v.book.testament === 'Testameta vaovao');
      console.log(`  - Old Testament: ${oldTestamentResults.length} results`);
      console.log(`  - New Testament: ${newTestamentResults.length} results`);
      
      if (oldTestamentResults.length > 0) {
        console.log(`  - Example OT book: ${oldTestamentResults[0].book.name}`);
      }
      if (newTestamentResults.length > 0) {
        console.log(`  - Example NT book: ${newTestamentResults[0].book.name}`);
      }
    }
    
    console.log('\n2. Testing search with OLD testament:');
    const oldOnly = await searchBible('Andriamanitra', { testament: 'old', limit: 5 });
    console.log('Results:', oldOnly.success ? `${oldOnly.data.length} verses found` : oldOnly.error);
    
    console.log('\n3. Testing search with NEW testament:');
    const newOnly = await searchBible('Andriamanitra', { testament: 'new', limit: 5 });
    console.log('Results:', newOnly.success ? `${newOnly.data.length} verses found` : newOnly.error);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSearchTestaments();
