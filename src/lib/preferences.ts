/**
 * User preferences and settings management
 * Handles theme, font size, reading preferences using localStorage
 */

export interface UserPreferences {
  // Reading preferences
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  
  // Display preferences
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  
  // Reading behavior
  autoScroll: boolean;
  showVerseNumbers: boolean;
  highlightVerses: boolean;
  
  // Navigation
  rememberLastPosition: boolean;
  showReadingProgress: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  fontSize: 'medium',
  fontFamily: 'serif',
  lineHeight: 'normal',
  theme: 'system',
  reducedMotion: false,
  autoScroll: false,
  showVerseNumbers: true,
  highlightVerses: true,
  rememberLastPosition: true,
  showReadingProgress: true,
};

const PREFERENCES_KEY = 'ny-baiboly-preferences';

/**
 * Get user preferences from localStorage
 */
export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {return DEFAULT_PREFERENCES;}
  
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) {return DEFAULT_PREFERENCES;}
    
    const parsed = JSON.parse(stored) as Partial<UserPreferences>;
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (error) {
    console.error('Error loading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save user preferences to localStorage
 */
export function saveUserPreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') {return;}
  
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    
    // Apply preferences immediately
    applyPreferences(preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

/**
 * Update specific preference
 */
export function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = { ...currentPreferences, [key]: value };
  saveUserPreferences(updatedPreferences);
}

/**
 * Apply preferences to the document
 */
export function applyPreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') {return;}
  
  const root = document.documentElement;
  
  // Font size
  const fontSizeMap = {
    'small': '14px',
    'medium': '16px',
    'large': '18px',
    'extra-large': '20px',
  };
  root.style.setProperty('--reading-font-size', fontSizeMap[preferences.fontSize]);
  
  // Font family
  const fontFamilyMap = {
    'serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'sans-serif': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'monospace': 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  };
  root.style.setProperty('--reading-font-family', fontFamilyMap[preferences.fontFamily]);
  
  // Line height
  const lineHeightMap = {
    'compact': '1.4',
    'normal': '1.6',
    'relaxed': '1.8',
  };
  root.style.setProperty('--reading-line-height', lineHeightMap[preferences.lineHeight]);
  
  // Theme
  if (preferences.theme === 'dark') {
    root.classList.add('dark');
  } else if (preferences.theme === 'light') {
    root.classList.remove('dark');
  } else {
    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
  
  // Reduced motion
  if (preferences.reducedMotion) {
    root.style.setProperty('--motion-reduce', 'reduce');
  } else {
    root.style.removeProperty('--motion-reduce');
  }
}

/**
 * Initialize preferences on app load
 */
export function initializePreferences(): void {
  const preferences = getUserPreferences();
  applyPreferences(preferences);
  
  // Listen for system theme changes
  if (preferences.theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      applyPreferences(preferences);
    });
  }
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences(): void {
  saveUserPreferences(DEFAULT_PREFERENCES);
}

/**
 * Export preferences as JSON
 */
export function exportPreferences(): string {
  const preferences = getUserPreferences();
  return JSON.stringify(preferences, null, 2);
}

/**
 * Import preferences from JSON
 */
export function importPreferences(jsonString: string): boolean {
  try {
    const preferences = JSON.parse(jsonString) as Partial<UserPreferences>;
    const validatedPreferences = { ...DEFAULT_PREFERENCES, ...preferences };
    saveUserPreferences(validatedPreferences);
    return true;
  } catch (error) {
    console.error('Error importing preferences:', error);
    return false;
  }
}
