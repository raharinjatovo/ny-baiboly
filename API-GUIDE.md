# Bible Reference Search API - Complete Working Guide

## ✅ **CORRECT API Usage**

You are absolutely correct! The GitHub data uses string keys like `'3'` and `'16'`, so our API needs to handle the conversion properly.

### **API Endpoint:**
```
POST http://localhost:3000/api/search-reference
```

### **Correct Request Format:**
```json
{
  "book": "John",
  "chapter": 3,
  "verses": [16]
}
```

## 📋 **Working Examples**

### 1. Single Verse (John 3:16)

**Bash/curl:**
```bash
curl -X POST http://localhost:3000/api/search-reference \
  -H "Content-Type: application/json" \
  -d '{"book": "John", "chapter": 3, "verses": [16]}'
```

**PowerShell:**
```powershell
$headers = @{'Content-Type' = 'application/json'}
$body = @{
    book = 'John'
    chapter = 3
    verses = @(16)
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/search-reference' -Method POST -Headers $headers -Body $body
```

**JavaScript:**
```javascript
const response = await fetch('/api/search-reference', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    book: 'John',
    chapter: 3,        // Number, not string
    verses: [16]       // Array of numbers
  })
});
const data = await response.json();
```

### 2. Multiple Verses (Psalm 23:1,4,6)

```json
{
  "book": "Psalm",
  "chapter": 23,
  "verses": [1, 4, 6]
}
```

### 3. Verse Range (Genesis 1:1-5)

```json
{
  "book": "Genesis", 
  "chapter": 1,
  "verses": [{"start": 1, "end": 5}]
}
```

### 4. Mixed Format (Romans 8:1-3,28,35)

```json
{
  "book": "Romans",
  "chapter": 8, 
  "verses": [{"start": 1, "end": 3}, 28, 35]
}
```

## 🔧 **Data Type Requirements**

- **book**: String (English name like "John", "Genesis", "Psalm")
- **chapter**: Number (like `3`, not `"3"`)
- **verses**: Array of numbers or range objects
  - Single verse: `[16]`
  - Multiple: `[1, 4, 6]` 
  - Range: `[{"start": 1, "end": 5}]`
  - Mixed: `[{"start": 1, "end": 3}, 28, 35]`

## 📊 **Expected Response Format**

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

## ❌ **Common Errors**

### Invalid JSON:
```bash
# WRONG - Escaped quotes cause JSON parsing errors
curl -d '{\"book\": \"John\"}' 

# CORRECT - Use proper quoting
curl -d '{"book": "John", "chapter": 3, "verses": [16]}'
```

### Wrong data types:
```json
// WRONG - Using strings instead of numbers
{"book": "John", "chapter": "3", "verses": ["16"]}

// CORRECT - Using proper data types  
{"book": "John", "chapter": 3, "verses": [16]}
```

### Unsupported format:
```json
// WRONG - Single reference string not supported
{"reference": "John 3:16"}

// CORRECT - Structured format required
{"book": "John", "chapter": 3, "verses": [16]}
```

## 🔍 **Troubleshooting**

1. **"Invalid JSON" error**: Check quote escaping in your curl command
2. **"Chapter not found" error**: Verify the book name and chapter number
3. **Empty response**: Check that verses exist in the specified chapter
4. **Connection errors**: Verify the server is running on the correct port

## 📚 **Supported Book Names**

The API accepts English book names like:
- Old Testament: Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, etc.
- New Testament: Matthew, Mark, Luke, John, Acts, Romans, 1 Corinthians, 2 Corinthians, etc.

Alternative names and abbreviations are also supported (Gen, Matt, Rom, etc.).
