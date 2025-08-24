// Test the Random Verse API and UI
const testRandomAPI = async () => {
  try {
    console.info('Testing Random Verse API and UI...\n');
    
    // Test our API endpoint
    console.info('Testing our Malagasy Random Verse API:');
    console.info('API URL: http://localhost:3000/api/random-verse');
    console.info('UI URL: http://localhost:3000/random');
    
    const response = await fetch('http://localhost:3000/api/random-verse', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.info('Our API Response:');
    console.info(JSON.stringify(data, null, 2));
    
    // Validate the structure matches bible-api.com format
    console.info('\n' + '='.repeat(60));
    console.info('VALIDATION:');
    console.info('✓ Has translation object:', !!data.translation);
    console.info('✓ Has random_verse object:', !!data.random_verse);
    console.info('✓ Translation has identifier:', !!data.translation?.identifier);
    console.info('✓ Translation has name:', !!data.translation?.name);
    console.info('✓ Translation has language:', !!data.translation?.language);
    console.info('✓ Translation has language_code:', !!data.translation?.language_code);
    console.info('✓ Translation has license:', !!data.translation?.license);
    console.info('✓ Random verse has book_id:', !!data.random_verse?.book_id);
    console.info('✓ Random verse has book:', !!data.random_verse?.book);
    console.info('✓ Random verse has chapter:', typeof data.random_verse?.chapter === 'number');
    console.info('✓ Random verse has verse:', typeof data.random_verse?.verse === 'number');
    console.info('✓ Random verse has text:', !!data.random_verse?.text);
    
    // Display verse details
    console.info('\n' + '='.repeat(60));
    console.info('VERSE DETAILS:');
    console.info(`Book: ${data.random_verse?.book} (${data.random_verse?.book_id})`);
    console.info(`Chapter: ${data.random_verse?.chapter}`);
    console.info(`Verse: ${data.random_verse?.verse}`);
    console.info(`Text: ${data.random_verse?.text}`);
    console.info(`Language: ${data.translation?.language} (${data.translation?.language_code})`);
    
    // Test multiple calls to ensure randomness
    console.info('\n' + '='.repeat(60));
    console.info('TESTING RANDOMNESS (5 additional calls):');
    
    for (let i = 1; i <= 5; i++) {
      const testResponse = await fetch('http://localhost:3000/api/random-verse');
      const testData = await testResponse.json();
      console.info(`${i}. ${testData.random_verse?.book} ${testData.random_verse?.chapter}:${testData.random_verse?.verse}`);
    }
    
  } catch (error) {
    console.error('Error testing Random Verse API:', error.message);
    
    // Try to give helpful debugging info
    if (error.message.includes('fetch failed')) {
      console.info('\nTroubleshooting:');
      console.info('- Make sure the development server is running: pnpm dev');
      console.info('- Check if the server is accessible at http://localhost:3000');
    }
  }
};

// Also test comparison with external API (optional)
const compareWithExternalAPI = async () => {
  try {
    console.info('\n' + '='.repeat(80));
    console.info('COMPARING WITH EXTERNAL API:');
    console.info('External API: https://bible-api.com/data/web/random');
    
    const externalResponse = await fetch('https://bible-api.com/data/web/random');
    const externalData = await externalResponse.json();
    
    console.info('External API Response:');
    console.info(JSON.stringify(externalData, null, 2));
    
  } catch (error) {
    console.info('Could not fetch external API for comparison:', error.message);
  }
};

// Run tests
const runAllTests = async () => {
  await testRandomAPI();
  await compareWithExternalAPI();
};

runAllTests();
