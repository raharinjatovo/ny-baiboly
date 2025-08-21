/**
 * API route for Bible search functionality
 * Handles server-side search operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchBible } from '@/lib/bible-data';
import { Testament } from '@/types/bible';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const testament = searchParams.get('testament');
    const caseSensitive = searchParams.get('caseSensitive') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchOptions = {
      testament: testament === 'old' ? Testament.OLD : 
                testament === 'new' ? Testament.NEW : undefined,
      caseSensitive,
      limit,
    };

    const result = await searchBible(query, searchOptions);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {} } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const result = await searchBible(query, options);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
