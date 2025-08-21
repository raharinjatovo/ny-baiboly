/**
 * API route for random Bible verses
 * Provides random verse functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRandomVerses } from '@/lib/bible-data';
import { Testament } from '@/types/bible';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '1');
    const testament = searchParams.get('testament');
    const books = searchParams.get('books')?.split(',').filter(Boolean);

    // Validate count
    if (count < 1 || count > 10) {
      return NextResponse.json(
        { success: false, error: 'Count must be between 1 and 10' },
        { status: 400 }
      );
    }

    const options = {
      testament: testament === 'old' ? Testament.OLD : 
                testament === 'new' ? Testament.NEW : undefined,
      books,
    };

    const result = await getRandomVerses(count, options);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Random verses API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 1, options = {} } = body;

    // Validate count
    if (count < 1 || count > 10) {
      return NextResponse.json(
        { success: false, error: 'Count must be between 1 and 10' },
        { status: 400 }
      );
    }

    const result = await getRandomVerses(count, options);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Random verses API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
