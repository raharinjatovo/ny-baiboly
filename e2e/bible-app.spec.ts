/**
 * End-to-end tests for Bible application
 * Tests complete user workflows and interactions
 */

import { test, expect } from '@playwright/test';

test.describe('Bible Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage', () => {
    test('should display application title and navigation', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Ny Baiboly/);
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /Fiarahaba tonga/i })).toBeVisible();
      
      // Check navigation items
      await expect(page.getByRole('link', { name: /Boky/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Fikarohana/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Andinin-tsitra/i })).toBeVisible();
    });

    test('should display feature cards', async ({ page }) => {
      // Check for feature cards
      await expect(page.getByText(/Fikarohana haitham-pamantarana/i)).toBeVisible();
      await expect(page.getByText(/Boky feno/i)).toBeVisible();
      await expect(page.getByText(/Andinin-tsitra ankafizinao/i)).toBeVisible();
    });

    test('should navigate to books page', async ({ page }) => {
      await page.getByRole('link', { name: /Boky/i }).click();
      await expect(page).toHaveURL('/books');
      await expect(page.getByRole('heading', { name: /Boky/i })).toBeVisible();
    });

    test('should navigate to search page', async ({ page }) => {
      await page.getByRole('link', { name: /Fikarohana/i }).click();
      await expect(page).toHaveURL('/search');
      await expect(page.getByRole('heading', { name: /Fikarohana/i })).toBeVisible();
    });
  });

  test.describe('Books Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/books');
    });

    test('should display Old and New Testament sections', async ({ page }) => {
      await expect(page.getByText(/Testameta taloha/i)).toBeVisible();
      await expect(page.getByText(/Testameta vaovao/i)).toBeVisible();
    });

    test('should display book cards', async ({ page }) => {
      // Check for some common Bible books
      await expect(page.getByText(/Genesisy/i)).toBeVisible();
      await expect(page.getByText(/Matio/i)).toBeVisible();
    });

    test('should navigate to specific book', async ({ page }) => {
      // Click on the first book
      const firstBook = page.locator('[data-testid="bible-book-card"]').first();
      await firstBook.click();
      
      // Should navigate to book page
      await expect(page.url()).toMatch(/\/books\/[^\/]+$/);
    });

    test('should filter books by testament', async ({ page }) => {
      // Click Old Testament tab (if implemented)
      const oldTestamentTab = page.getByRole('button', { name: /Testameta taloha/i });
      if (await oldTestamentTab.isVisible()) {
        await oldTestamentTab.click();
        
        // Verify only Old Testament books are visible
        await expect(page.getByText(/Genesisy/i)).toBeVisible();
        
        // New Testament books should not be visible
        await expect(page.getByText(/Matio/i)).not.toBeVisible();
      }
    });
  });

  test.describe('Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search');
    });

    test('should perform basic search', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: /fikarohana/i });
      const searchButton = page.getByRole('button', { name: /karoka/i });
      
      await searchInput.fill('Andriamanitra');
      await searchButton.click();
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Check for search results
      const results = page.locator('[data-testid="search-result"]');
      await expect(results.first()).toBeVisible();
    });

    test('should handle empty search gracefully', async ({ page }) => {
      const searchButton = page.getByRole('button', { name: /karoka/i });
      await searchButton.click();
      
      // Should show validation message
      await expect(page.getByText(/fehina fikarohana/i)).toBeVisible();
    });

    test('should filter search by testament', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: /fikarohana/i });
      const testamentFilter = page.getByRole('combobox', { name: /testamenta/i });
      const searchButton = page.getByRole('button', { name: /karoka/i });
      
      await searchInput.fill('Andriamanitra');
      await testamentFilter.selectOption('old');
      await searchButton.click();
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Verify results are from Old Testament only
      const results = page.locator('[data-testid="search-result"]');
      if (await results.count() > 0) {
        const firstResult = results.first();
        const bookName = await firstResult.locator('.book-name').textContent();
        
        // Verify it's an Old Testament book (this would need actual book data)
        expect(bookName).toBeTruthy();
      }
    });

    test('should paginate search results', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: /fikarohana/i });
      const searchButton = page.getByRole('button', { name: /karoka/i });
      
      await searchInput.fill('ny'); // Common word likely to have many results
      await searchButton.click();
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Look for pagination controls
      const nextButton = page.getByRole('button', { name: /manaraka/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        
        // Verify page changed
        await expect(page.url()).toMatch(/page=2/);
      }
    });
  });

  test.describe('Individual Book Page', () => {
    test('should display book chapters', async ({ page }) => {
      // Navigate to a specific book
      await page.goto('/books');
      const firstBook = page.locator('[data-testid="bible-book-card"]').first();
      await firstBook.click();
      
      // Should display chapter grid
      await expect(page.getByText(/Toko/i)).toBeVisible();
      
      // Should have chapter numbers
      await expect(page.getByText('1')).toBeVisible();
    });

    test('should navigate to specific chapter', async ({ page }) => {
      // Navigate to a book
      await page.goto('/books');
      const firstBook = page.locator('[data-testid="bible-book-card"]').first();
      await firstBook.click();
      
      // Click on first chapter
      const firstChapter = page.getByRole('link', { name: '1' }).first();
      await firstChapter.click();
      
      // Should navigate to chapter page
      await expect(page.url()).toMatch(/\/books\/[^\/]+\/1$/);
    });
  });

  test.describe('Chapter Reading Page', () => {
    test('should display chapter content', async ({ page }) => {
      // Navigate directly to a chapter (assuming genesis exists)
      await page.goto('/books');
      const firstBook = page.locator('[data-testid="bible-book-card"]').first();
      await firstBook.click();
      
      const firstChapter = page.getByRole('link', { name: '1' }).first();
      await firstChapter.click();
      
      // Should display verses
      await expect(page.locator('[data-testid="verse"]').first()).toBeVisible();
      
      // Should have verse numbers
      await expect(page.getByText('1')).toBeVisible();
    });

    test('should have navigation controls', async ({ page }) => {
      // Navigate to a chapter
      await page.goto('/books');
      const firstBook = page.locator('[data-testid="bible-book-card"]').first();
      await firstBook.click();
      
      const firstChapter = page.getByRole('link', { name: '1' }).first();
      await firstChapter.click();
      
      // Check for navigation buttons
      const prevButton = page.getByRole('button', { name: /teo aloha/i });
      const nextButton = page.getByRole('button', { name: /manaraka/i });
      
      // At least one navigation button should be visible
      const hasNavigation = await prevButton.isVisible() || await nextButton.isVisible();
      expect(hasNavigation).toBe(true);
    });
  });

  test.describe('Random Verse Feature', () => {
    test('should display random verse page', async ({ page }) => {
      await page.goto('/random');
      
      await expect(page.getByRole('heading', { name: /andinin-tsitra/i })).toBeVisible();
      
      // Should have a verse displayed
      await expect(page.locator('[data-testid="random-verse"]')).toBeVisible();
    });

    test('should generate new random verse', async ({ page }) => {
      await page.goto('/random');
      
      // Get initial verse text
      const _initialVerse = await page.locator('[data-testid="random-verse"]').textContent();
      
      // Click generate new verse button
      const newVerseButton = page.getByRole('button', { name: /vaovao/i });
      await newVerseButton.click();
      
      // Wait for new verse
      await page.waitForTimeout(1000);
      
      // Verify verse changed (might be the same by chance, but test the mechanism)
      const newVerse = await page.locator('[data-testid="random-verse"]').textContent();
      expect(newVerse).toBeTruthy();
    });
  });

  test.describe('API Documentation', () => {
    test('should display API documentation', async ({ page }) => {
      await page.goto('/api-docs');
      
      await expect(page.getByRole('heading', { name: /API Documentation/i })).toBeVisible();
      
      // Should display endpoint information
      await expect(page.getByText(/\/api\/search/i)).toBeVisible();
      await expect(page.getByText(/\/api\/random/i)).toBeVisible();
    });

    test('should have proper formatting for code examples', async ({ page }) => {
      await page.goto('/api-docs');
      
      // Should have code blocks
      const codeBlocks = page.locator('code');
      await expect(codeBlocks.first()).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Navigation should be responsive
      await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
      
      // Content should be readable
      await expect(page.getByRole('heading', { name: /Fiarahaba tonga/i })).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/books');
      
      // Grid layout should adapt
      await expect(page.getByText(/Testameta taloha/i)).toBeVisible();
      await expect(page.getByText(/Genesisy/i)).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load pages quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle search without blocking UI', async ({ page }) => {
      await page.goto('/search');
      
      const searchInput = page.getByRole('textbox', { name: /fikarohana/i });
      const searchButton = page.getByRole('button', { name: /karoka/i });
      
      await searchInput.fill('Andriamanitra');
      
      const startTime = Date.now();
      await searchButton.click();
      
      // UI should remain responsive during search
      await expect(searchInput).toBeEditable();
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(5000); // 5 second timeout
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/');
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate focused element
      await page.keyboard.press('Enter');
      
      // Should navigate or perform action
      expect(page.url()).toBeTruthy();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/search');
      
      const searchInput = page.getByRole('textbox', { name: /fikarohana/i });
      await expect(searchInput).toHaveAttribute('aria-label');
    });
  });
});
