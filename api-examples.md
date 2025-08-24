# Bible Reference Search API - WORKING EXAMPLES

## ✅ **CORRECT API Usage**

### **API Endpoint:**
```
POST http://localhost:3000/api/search-reference
```

### **Request Body Format:**
```json
{
  "book": "John",
  "chapter": 3,
  "verses": [16]
}
```

## 📋 **Working Examples**

### 1. **Single Verse - John 3:16**

**PowerShell:**
```powershell
$headers = @{'Content-Type' = 'application/json'}
$body = '{"book": "John", "chapter": 3, "verses": [16]}'
$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/search-reference' -Method POST -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 5
```

**cURL (Git Bash/Linux):**
```bash
curl -X POST http://localhost:3000/api/search-reference \
  -H "Content-Type: application/json" \
  -d '{"book": "John", "chapter": 3, "verses": [16]}'
```

**JavaScript/Node.js:**
```javascript
const response = await fetch('http://localhost:3000/api/search-reference', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    book: 'John',
    chapter: 3,
    verses: [16]
  })
});
const data = await response.json();
console.log(data);
```

### 2. **Multiple Verses - Psalm 23:1,4,6**

```json
{
  "book": "Psalm",
  "chapter": 23,
  "verses": [1, 4, 6]
}
```

### 3. **Verse Range - Genesis 1:1-3**

```json
{
  "book": "Genesis",
  "chapter": 1,
  "verses": [{"start": 1, "end": 3}]
}
```

### 4. **Mixed Format - Romans 8:1-3,28,35**

```json
{
  "book": "Romans",
  "chapter": 8,
  "verses": [{"start": 1, "end": 3}, 28, 35]
}
```

## 📊 **Response Format**

**Success Response:**
```json
{
  "verses": [
    {
      "book": "Jaona",
      "bookId": "jaona",
      "chapter": "3",
      "verse": "16",
      "text": "Fa toy izao no nitiavan'Andriamanitra...",
      "reference": "Jaona 3:16"
    }
  ],
  "requestedCount": 1,
  "foundCount": 1,
  "book": "Jaona",
  "chapter": "3",
  "executionTime": 45
}
```

**Error Response:**
```json
{
  "error": "Book not found: \"InvalidBook\". Please check the spelling or try a different name.",
  "availableBooks": ["john", "genesis", "psalm", "romans", "matthew", "mark", "luke", "acts", "1 corinthians", "2 corinthians"]
}
```

## 🔧 **Testing Commands**

**Test Single Verse (PowerShell):**
```powershell
$body = '{"book": "John", "chapter": 3, "verses": [16]}'
Invoke-RestMethod -Uri 'http://localhost:3000/api/search-reference' -Method POST -Body $body -ContentType 'application/json'
```

**Test Multiple Verses (PowerShell):**
```powershell
$body = '{"book": "Psalm", "chapter": 23, "verses": [1, 4, 6]}'
Invoke-RestMethod -Uri 'http://localhost:3000/api/search-reference' -Method POST -Body $body -ContentType 'application/json'
```

**Test Verse Range (PowerShell):**
```powershell
$body = '{"book": "Genesis", "chapter": 1, "verses": [{"start": 1, "end": 3}]}'
Invoke-RestMethod -Uri 'http://localhost:3000/api/search-reference' -Method POST -Body $body -ContentType 'application/json'
```

## 📚 **Supported Books**

The API accepts English book names:
- **Old Testament:** Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalm, Proverbs, Ecclesiastes, Song of Songs, Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi

- **New Testament:** Matthew, Mark, Luke, John, Acts, Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon, Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude, Revelation

## 🚨 **Common Issues**

**❌ WRONG FORMAT (will fail):**
```json
{"reference": "John 3:16"}
```

**✅ CORRECT FORMAT:**
```json
{
  "book": "John",
  "chapter": 3,
  "verses": [16]
}
```

## 🛡️ **Rate Limiting**

- **Limit:** 100 requests per 15 minutes per IP address
- **Response Headers:** Include rate limit information
- **Error:** HTTP 429 when limit exceeded

## 5. JavaScript/TypeScript Example

```typescript
async function searchBibleReference(reference: string) {
  try {
    const response = await fetch('http://localhost:3000/api/search-reference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Found verses:', data.data.verses);
      return data.data;
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Usage examples:
searchBibleReference('John 3:16');
searchBibleReference('Psalm 23:1,4,6');
searchBibleReference('Genesis 1:1-5');
```

## 6. React Component Example

```tsx
import { useState } from 'react';

function BibleSearch() {
  const [reference, setReference] = useState('');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/search-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVerses(data.data.verses);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g., John 3:16"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {verses.map((verse, index) => (
        <div key={index}>
          <strong>{verse.book} {verse.chapter}:{verse.verse}</strong>
          <p>{verse.text}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

### Common Error Responses:

1. **Invalid book name:**
```json
{
  "success": false,
  "error": "Book \"InvalidBook\" not found. Please check spelling or use a different name."
}
```

2. **Invalid format:**
```json
{
  "success": false,
  "error": "Invalid format. Use: \"Book Chapter:Verses\" (e.g., \"John 3:16\" or \"Genesis 1:1-3\")"
}
```

3. **Rate limiting:**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

## Supported Book Names

The API supports English book names and abbreviations:
- **Full names:** John, Genesis, Psalm, Romans, etc.
- **Abbreviations:** Gen, Exod, Lev, Num, Deut, etc.
- **Alternative names:** Song of Songs, Song of Solomon, etc.

## Rate Limiting

- **Limit:** 100 requests per 15-minute window per IP
- **Headers:** Rate limit info is included in response headers
