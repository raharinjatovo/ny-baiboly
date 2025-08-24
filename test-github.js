// Test direct GitHub data access
async function testGitHubData() {
  try {
    console.info('Testing direct GitHub data access...');
    
    const url = 'https://raw.githubusercontent.com/RaveloMevaSoavina/baiboly-json/refs/heads/master/Testameta%20vaovao/jaona.json';
    console.info('URL:', url);
    
    const response = await fetch(url);
    console.info('GitHub Response Status:', response.status);
    
    if (response.ok) {
      const text = await response.text();
      console.info('Data length:', text.length);
      
      const data = JSON.parse(text);
      console.info('Chapters available:', Object.keys(data).filter(key => key !== 'meta'));
      console.info('Chapter 3 exists:', !!data['3']);
      console.info('Chapter "3" exists:', !!data[3]);
      
      if (data['3'] || data[3]) {
        const chapter3 = data['3'] || data[3];
        console.info('Verses in chapter 3:', Object.keys(chapter3).length);
        console.info('Verse 16 exists:', !!(chapter3['16'] || chapter3[16]));
      }
    } else {
      console.info('Failed to fetch:', response.statusText);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGitHubData();
