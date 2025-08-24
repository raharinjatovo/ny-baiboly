// Test the bible repository directly
import { bibleRepository } from './src/lib/bible-repository.js';

async function testRepository() {
  try {
    console.log('Testing bible repository...');
    
    // Test getting the book
    const bookResponse = await bibleRepository.getBook('jaona');
    console.log('Book response success:', bookResponse.success);
    
    if (!bookResponse.success) {
      console.log('Book error:', bookResponse.error);
    } else {
      console.log('Book data chapters:', Object.keys(bookResponse.data.chapters));
    }
    
  } catch (error) {
    console.error('Repository error:', error.message);
  }
}

testRepository();
