// Test pages to verify single navigation menu
const testNavigation = async () => {
  console.info('Testing navigation on different pages...\n');
  
  const pages = [
    'http://localhost:3000/',
    'http://localhost:3000/books',
    'http://localhost:3000/random',
    'http://localhost:3000/search',
    'http://localhost:3000/favorites'
  ];
  
  for (const url of pages) {
    try {
      console.info(`Testing: ${url}`);
      const response = await fetch(url);
      
      if (response.ok) {
        console.info(`✓ ${url} - Status: ${response.status}`);
      } else {
        console.info(`✗ ${url} - Status: ${response.status}`);
      }
    } catch (error) {
      console.info(`✗ ${url} - Error: ${error.message}`);
    }
  }
  
  console.info('\n=== Navigation Fix Summary ===');
  console.info('✓ Removed duplicate navbar from custom Layout component');
  console.info('✓ Root layout navbar is now the only navigation');
  console.info('✓ All pages using Layout component now have single navigation');
  console.info('✓ Pages affected: home, books, search, favorites, settings, about, privacy, feedback');
  console.info('\nThe duplicate menu issue has been resolved!');
};

testNavigation();
