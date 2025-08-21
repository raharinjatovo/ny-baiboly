/**
 * Bible books constants and metadata
 * Centralized configuration for all Bible books following DRY principles
 */

import { BookMeta, Testament } from '@/types/bible';

/**
 * Old Testament books metadata
 * Organized in canonical order with proper Malagasy names
 */
export const OLD_TESTAMENT_BOOKS: BookMeta[] = [
  { id: 'genesis', name: 'Genesisy', fileName: 'genesisy', testament: Testament.OLD },
  { id: 'exodus', name: 'Eksodosy', fileName: 'eksodosy', testament: Testament.OLD },
  { id: 'leviticus', name: 'Levitikosy', fileName: 'levitikosy', testament: Testament.OLD },
  { id: 'numbers', name: 'Nomery', fileName: 'nomery', testament: Testament.OLD },
  { id: 'deuteronomy', name: 'Deoteronomia', fileName: 'deoteronomia', testament: Testament.OLD },
  { id: 'joshua', name: 'Josoa', fileName: 'josoa', testament: Testament.OLD },
  { id: 'judges', name: 'Mpitsara', fileName: 'mpitsara', testament: Testament.OLD },
  { id: 'ruth', name: 'Rota', fileName: 'rota', testament: Testament.OLD },
  { id: '1-samuel', name: 'Samoela voalohany', fileName: 'samoela-voalohany', testament: Testament.OLD },
  { id: '2-samuel', name: 'Samoela faharoa', fileName: 'samoela-faharoa', testament: Testament.OLD },
  { id: '1-kings', name: 'Mpanjaka voalohany', fileName: 'mpanjaka-voalohany', testament: Testament.OLD },
  { id: '2-kings', name: 'Mpanjaka faharoa', fileName: 'mpanjaka-faharoa', testament: Testament.OLD },
  { id: '1-chronicles', name: 'Tantara voalohany', fileName: 'tantara-voalohany', testament: Testament.OLD },
  { id: '2-chronicles', name: 'Tantara faharoa', fileName: 'tantara-faharoa', testament: Testament.OLD },
  { id: 'ezra', name: 'Ezra', fileName: 'ezra', testament: Testament.OLD },
  { id: 'nehemiah', name: 'Nehemia', fileName: 'nehemia', testament: Testament.OLD },
  { id: 'esther', name: 'Estera', fileName: 'estera', testament: Testament.OLD },
  { id: 'job', name: 'Joba', fileName: 'joba', testament: Testament.OLD },
  { id: 'psalms', name: 'Salamo', fileName: 'salamo', testament: Testament.OLD },
  { id: 'proverbs', name: 'Ohabolana', fileName: 'ohabolana', testament: Testament.OLD },
  { id: 'ecclesiastes', name: 'Mpitoriteny', fileName: 'mpitoriteny', testament: Testament.OLD },
  { id: 'song-of-songs', name: 'Tononkirani Solomona', fileName: 'tononkirani-solomona', testament: Testament.OLD },
  { id: 'isaiah', name: 'Isaia', fileName: 'isaia', testament: Testament.OLD },
  { id: 'jeremiah', name: 'Jeremia', fileName: 'jeremia', testament: Testament.OLD },
  { id: 'lamentations', name: 'Fitomaniana', fileName: 'fitomaniana', testament: Testament.OLD },
  { id: 'ezekiel', name: 'Ezekiela', fileName: 'ezekiela', testament: Testament.OLD },
  { id: 'daniel', name: 'Daniela', fileName: 'daniela', testament: Testament.OLD },
  { id: 'hosea', name: 'Hosea', fileName: 'hosea', testament: Testament.OLD },
  { id: 'joel', name: 'Joela', fileName: 'joela', testament: Testament.OLD },
  { id: 'amos', name: 'Amosa', fileName: 'amosa', testament: Testament.OLD },
  { id: 'obadiah', name: 'Obadia', fileName: 'obadia', testament: Testament.OLD },
  { id: 'jonah', name: 'Jona', fileName: 'jona', testament: Testament.OLD },
  { id: 'micah', name: 'Mika', fileName: 'mika', testament: Testament.OLD },
  { id: 'nahum', name: 'Nahoma', fileName: 'nahoma', testament: Testament.OLD },
  { id: 'habakkuk', name: 'Habakoka', fileName: 'habakoka', testament: Testament.OLD },
  { id: 'zephaniah', name: 'Zefania', fileName: 'zefania', testament: Testament.OLD },
  { id: 'haggai', name: 'Hagay', fileName: 'hagay', testament: Testament.OLD },
  { id: 'zechariah', name: 'Zakaria', fileName: 'zakaria', testament: Testament.OLD },
  { id: 'malachi', name: 'Malakia', fileName: 'malakia', testament: Testament.OLD },
];

/**
 * New Testament books metadata
 * Organized in canonical order with proper Malagasy names
 */
export const NEW_TESTAMENT_BOOKS: BookMeta[] = [
  { id: 'matthew', name: 'Matio', fileName: 'matio', testament: Testament.NEW },
  { id: 'mark', name: 'Marka', fileName: 'marka', testament: Testament.NEW },
  { id: 'luke', name: 'Lioka', fileName: 'lioka', testament: Testament.NEW },
  { id: 'john', name: 'Jaona', fileName: 'jaona', testament: Testament.NEW },
  { id: 'acts', name: 'Asanny Apostoly', fileName: 'asanny-apostoly', testament: Testament.NEW },
  { id: 'romans', name: 'Romanina', fileName: 'romanina', testament: Testament.NEW },
  { id: '1-corinthians', name: '1 Korintianina', fileName: '1-korintianina', testament: Testament.NEW },
  { id: '2-corinthians', name: '2 Korintianina', fileName: '2-korintianina', testament: Testament.NEW },
  { id: 'galatians', name: 'Galatianina', fileName: 'galatianina', testament: Testament.NEW },
  { id: 'ephesians', name: 'Efesianina', fileName: 'efesianina', testament: Testament.NEW },
  { id: 'philippians', name: 'Filipianina', fileName: 'filipianina', testament: Testament.NEW },
  { id: 'colossians', name: 'Kolosianina', fileName: 'kolosianina', testament: Testament.NEW },
  { id: '1-thessalonians', name: '1 Tesalonianina', fileName: '1-tesalonianina', testament: Testament.NEW },
  { id: '2-thessalonians', name: '2 Tesalonianina', fileName: '2-tesalonianina', testament: Testament.NEW },
  { id: '1-timothy', name: '1 Timoty', fileName: '1-timoty', testament: Testament.NEW },
  { id: '2-timothy', name: '2 Timoty', fileName: '2-timoty', testament: Testament.NEW },
  { id: 'titus', name: 'Titosy', fileName: 'titosy', testament: Testament.NEW },
  { id: 'philemon', name: 'Filemona', fileName: 'filemona', testament: Testament.NEW },
  { id: 'hebrews', name: 'Hebreo', fileName: 'hebreo', testament: Testament.NEW },
  { id: 'james', name: 'Jakoba', fileName: 'jakoba', testament: Testament.NEW },
  { id: '1-peter', name: '1 Petera', fileName: '1-petera', testament: Testament.NEW },
  { id: '2-peter', name: '2 Petera', fileName: '2-petera', testament: Testament.NEW },
  { id: '1-john', name: '1 Jaona', fileName: '1-jaona', testament: Testament.NEW },
  { id: '2-john', name: '2 Jaona', fileName: '2-jaona', testament: Testament.NEW },
  { id: '3-john', name: '3 Jaona', fileName: '3-jaona', testament: Testament.NEW },
  { id: 'jude', name: 'Joda', fileName: 'joda', testament: Testament.NEW },
  { id: 'revelation', name: 'Apokalypsy', fileName: 'apokalypsy', testament: Testament.NEW },
];

/**
 * Complete Bible books list
 */
export const ALL_BIBLE_BOOKS: BookMeta[] = [
  ...OLD_TESTAMENT_BOOKS,
  ...NEW_TESTAMENT_BOOKS,
];

/**
 * Book lookup map for fast access by ID
 */
export const BOOKS_BY_ID = new Map<string, BookMeta>(
  ALL_BIBLE_BOOKS.map(book => [book.id, book])
);

/**
 * Book lookup map for fast access by file name
 */
export const BOOKS_BY_FILENAME = new Map<string, BookMeta>(
  ALL_BIBLE_BOOKS.map(book => [book.fileName, book])
);

/**
 * Testament organization
 */
export const TESTAMENTS = {
  [Testament.OLD]: {
    name: 'Testameta Taloha',
    books: OLD_TESTAMENT_BOOKS,
    count: OLD_TESTAMENT_BOOKS.length,
  },
  [Testament.NEW]: {
    name: 'Testameta Vaovao', 
    books: NEW_TESTAMENT_BOOKS,
    count: NEW_TESTAMENT_BOOKS.length,
  },
} as const;

/**
 * Application constants
 */
export const APP_CONFIG = {
  name: 'Ny Baiboly',
  version: '1.0.0',
  description: 'Baiboly amin\'ny teny Malagasy - Bible reading application',
  defaultLanguage: 'mg',
  maxSearchResults: 50,
  defaultChapterLoadLimit: 10,
  cacheTimeout: 1000 * 60 * 15, // 15 minutes
} as const;

/**
 * File paths for data
 */
export const DATA_PATHS = {
  base: '/data/baiboly-json',
  oldTestament: '/data/baiboly-json/Testameta taloha',
  newTestament: '/data/baiboly-json/Testameta vaovao',
} as const;

/**
 * UI Constants
 */
export const UI_CONFIG = {
  navbar: {
    height: '4rem',
    mobileHeight: '3.5rem',
  },
  sidebar: {
    width: '280px',
    collapsedWidth: '64px',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    large: '1280px',
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
} as const;

/**
 * Color scheme definitions
 */
export const COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
} as const;
