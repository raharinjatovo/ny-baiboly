/**
 * API Documentation Page
 * Comprehensive documentation for the Bible Search API
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ApiDocumentationPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to the Ny Baiboly (Malagasy Bible) API - Search and Random Verses
        </p>
      </div>

      {/* Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            The Bible Search API provides powerful search capabilities across the entire Malagasy Bible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Endpoints</h3>
            <div className="space-y-2">
              <div>
                <code className="bg-muted px-3 py-1 rounded text-sm mr-2">
                  /api/search
                </code>
                <span className="text-sm text-muted-foreground">Search Bible verses</span>
              </div>
              <div>
                <code className="bg-muted px-3 py-1 rounded text-sm mr-2">
                  /api/random
                </code>
                <span className="text-sm text-muted-foreground">Get random Bible verses</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Supported Methods</h3>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border">GET</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border">POST</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GET Endpoint */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">GET</span>
            Search Bible via Query Parameters
          </CardTitle>
          <CardDescription>
            Search for verses using URL query parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Endpoint</h3>
            <code className="bg-muted px-3 py-2 rounded block text-sm">
              GET /api/search?q={'{'}query{'}'}&testament={'{'}testament{'}'}&caseSensitive={'{'}boolean{'}'}&limit={'{'}number{'}'}
            </code>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Query Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Parameter</th>
                    <th className="border border-border px-4 py-2 text-left">Type</th>
                    <th className="border border-border px-4 py-2 text-left">Required</th>
                    <th className="border border-border px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">q</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">Required</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      The search query. Can be single words, phrases, or multiple terms.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">testament</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Filter by testament. Values: <code>&quot;old&quot;</code> or <code>&quot;new&quot;</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">caseSensitive</td>
                    <td className="border border-border px-4 py-2">boolean</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Whether search should be case-sensitive. Default: <code>false</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">limit</td>
                    <td className="border border-border px-4 py-2">number</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Maximum number of results to return. Default: <code>50</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Example Request</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`curl -X GET "/api/search?q=fitiavana&testament=new&limit=10"`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* POST Endpoint */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">POST</span>
            Search Bible via Request Body
          </CardTitle>
          <CardDescription>
            Search for verses using JSON request body with advanced options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Endpoint</h3>
            <code className="bg-muted px-3 py-2 rounded block text-sm">
              POST /api/search
            </code>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Request Body Schema</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`{
  "query": "string (required)",
  "options": {
    "books": ["string"] (optional),
    "testament": "old" | "new" (optional),
    "limit": number (optional, default: 50),
    "caseSensitive": boolean (optional, default: false)
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Request Body Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Parameter</th>
                    <th className="border border-border px-4 py-2 text-left">Type</th>
                    <th className="border border-border px-4 py-2 text-left">Required</th>
                    <th className="border border-border px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">query</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">Required</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      The search query. Can be single words, phrases, or multiple terms.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">options.books</td>
                    <td className="border border-border px-4 py-2">string[]</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Array of book IDs to search within. Restricts search to specific books.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">options.testament</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Filter by testament. Values: <code>&quot;old&quot;</code> or <code>&quot;new&quot;</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">options.limit</td>
                    <td className="border border-border px-4 py-2">number</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Maximum number of results to return. Default: <code>50</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">options.caseSensitive</td>
                    <td className="border border-border px-4 py-2">boolean</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Whether search should be case-sensitive. Default: <code>false</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Example Request</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`curl -X POST "/api/search" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Andriamanitra fitiavana",
    "options": {
      "testament": "new",
      "limit": 20,
      "caseSensitive": false,
      "books": ["1-jaona", "matio", "jaona"]
    }
  }'`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Random Verses API */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">GET</span>
            Random Bible Verses
          </CardTitle>
          <CardDescription>
            Get random Bible verses with optional filtering
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Endpoint</h3>
            <code className="bg-muted px-3 py-2 rounded block text-sm">
              GET /api/random?count={'{'}number{'}'}&testament={'{'}testament{'}'}&books={'{'}books{'}'}
            </code>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Query Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Parameter</th>
                    <th className="border border-border px-4 py-2 text-left">Type</th>
                    <th className="border border-border px-4 py-2 text-left">Required</th>
                    <th className="border border-border px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">count</td>
                    <td className="border border-border px-4 py-2">number</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Number of random verses to return (1-10). Default: <code>1</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">testament</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Filter by testament. Values: <code>&quot;old&quot;</code> or <code>&quot;new&quot;</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">books</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Optional</span>
                    </td>
                    <td className="border border-border px-4 py-2">
                      Comma-separated list of book IDs to include
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Example Requests</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Single Random Verse</h4>
                <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`curl -X GET "/api/random"`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Multiple Verses from New Testament</h4>
                <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`curl -X GET "/api/random?count=3&testament=new"`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Format */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Response Format</CardTitle>
          <CardDescription>
            Standard response structure for all search endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Success Response Schema</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`{
  "success": true,
  "data": [
    {
      "book": {
        "id": "string",
        "name": "string",
        "fileName": "string",
        "testament": "Testameta taloha" | "Testameta vaovao"
      },
      "chapter": "string",
      "verse": "string",
      "text": "string",
      "relevance": number
    }
  ]
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Error Response Schema</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`{
  "success": false,
  "error": "string",
  "data": null
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Response Fields</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Field</th>
                    <th className="border border-border px-4 py-2 text-left">Type</th>
                    <th className="border border-border px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">success</td>
                    <td className="border border-border px-4 py-2">boolean</td>
                    <td className="border border-border px-4 py-2">
                      Indicates if the request was successful
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">data</td>
                    <td className="border border-border px-4 py-2">SearchResult[] | null</td>
                    <td className="border border-border px-4 py-2">
                      Array of search results, or null if error occurred
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">error</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      Error message (only present when success is false)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">data[].book</td>
                    <td className="border border-border px-4 py-2">BookMeta</td>
                    <td className="border border-border px-4 py-2">
                      Book metadata including ID, name, and testament
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">data[].chapter</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      Chapter number where the verse was found
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">data[].verse</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      Verse number where the match was found
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">data[].text</td>
                    <td className="border border-border px-4 py-2">string</td>
                    <td className="border border-border px-4 py-2">
                      The verse text content (may include highlighted search terms)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-mono text-sm">data[].relevance</td>
                    <td className="border border-border px-4 py-2">number</td>
                    <td className="border border-border px-4 py-2">
                      Relevance score for sorting results (higher = more relevant)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HTTP Status Codes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>HTTP Status Codes</CardTitle>
          <CardDescription>
            Standard HTTP status codes returned by the API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left">Status Code</th>
                  <th className="border border-border px-4 py-2 text-left">Meaning</th>
                  <th className="border border-border px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800 border">200</span>
                  </td>
                  <td className="border border-border px-4 py-2">OK</td>
                  <td className="border border-border px-4 py-2">
                    Request successful, search completed
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">400</span>
                  </td>
                  <td className="border border-border px-4 py-2">Bad Request</td>
                  <td className="border border-border px-4 py-2">
                    Missing or invalid search query parameter
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">500</span>
                  </td>
                  <td className="border border-border px-4 py-2">Internal Server Error</td>
                  <td className="border border-border px-4 py-2">
                    Server error during search processing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            Common use cases and example implementations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">JavaScript/Fetch Example</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`// Simple search using fetch
async function searchBible(query) {
  try {
    const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
    const result = await response.json();
    
    if (result.success) {
      console.log('Search results:', result.data);
      return result.data;
    } else {
      console.error('Search error:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Network error:', error);
    return [];
  }
}

// Advanced search with options
async function advancedSearch(query, options = {}) {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        options
      })
    });
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Usage examples
searchBible('fitiavana');
advancedSearch('Andriamanitra', {
  testament: 'new',
  limit: 10,
  caseSensitive: false
});`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">React Hook Example</h3>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`import { useState, useEffect } from 'react';

function useBibleSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query, options = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, options })
      });

      const result = await response.json();
      
      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error);
        setResults([]);
      }
    } catch (err) {
      setError('Failed to search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>
            Guidelines for optimal API usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Search Query Optimization</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Use specific keywords for better relevance</li>
              <li>Combine multiple terms with spaces for phrase searching</li>
              <li>Use testament filtering to narrow results</li>
              <li>Set appropriate limits to avoid large response payloads</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Error Handling</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Always check the <code>success</code> field in responses</li>
              <li>Handle network errors with try-catch blocks</li>
              <li>Provide user-friendly error messages</li>
              <li>Implement retry logic for temporary failures</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Performance Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Implement debouncing for real-time search</li>
              <li>Cache frequent search results client-side</li>
              <li>Use reasonable limit values (default 50 is recommended)</li>
              <li>Consider pagination for large result sets</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Book IDs Reference */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Book IDs Reference</CardTitle>
          <CardDescription>
            Complete list of available book IDs for targeted searches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Testameta taloha (Old Testament)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
              <code>genesisy</code>
              <code>eksodosy</code>
              <code>levitikosy</code>
              <code>nomery</code>
              <code>deoteronomia</code>
              <code>josoa</code>
              <code>mpitsara</code>
              <code>rota</code>
              <code>samoela-voalohany</code>
              <code>samoela-faharoa</code>
              <code>mpanjaka-voalohany</code>
              <code>mpanjaka-faharoa</code>
              <code>tantara-voalohany</code>
              <code>tantara-faharoa</code>
              <code>ezra</code>
              <code>nehemia</code>
              <code>estera</code>
              <code>joba</code>
              <code>salamo</code>
              <code>ohabolana</code>
              <code>mpitoriteny</code>
              <code>tononkirani-solomona</code>
              <code>isaia</code>
              <code>jeremia</code>
              <code>fitomaniana</code>
              <code>ezekiela</code>
              <code>daniela</code>
              <code>hosea</code>
              <code>joela</code>
              <code>amosa</code>
              <code>obadia</code>
              <code>jona</code>
              <code>mika</code>
              <code>nahoma</code>
              <code>habakoka</code>
              <code>zefania</code>
              <code>hagay</code>
              <code>zakaria</code>
              <code>malakia</code>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Testameta vaovao (New Testament)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
              <code>matio</code>
              <code>marka</code>
              <code>lioka</code>
              <code>jaona</code>
              <code>asanny-apostoly</code>
              <code>romanina</code>
              <code>1-korintianina</code>
              <code>2-korintianina</code>
              <code>galatianina</code>
              <code>efesianina</code>
              <code>filipianina</code>
              <code>kolosianina</code>
              <code>1-tesalonianina</code>
              <code>2-tesalonianina</code>
              <code>1-timoty</code>
              <code>2-timoty</code>
              <code>titosy</code>
              <code>filemona</code>
              <code>hebreo</code>
              <code>jakoba</code>
              <code>1-petera</code>
              <code>2-petera</code>
              <code>1-jaona</code>
              <code>2-jaona</code>
              <code>3-jaona</code>
              <code>joda</code>
              <code>apokalypsy</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentationPage;
