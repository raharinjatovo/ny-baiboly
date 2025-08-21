# Ny Baiboly - Professional Malagasy Bible Application

## 🌟 Overview

Ny Baiboly is a modern, enterprise-grade Bible reading application built with Next.js 15, featuring the complete Malagasy Bible with advanced search capabilities, clean architecture, and professional development practices.

## ✨ Features

### Core Functionality
- 📖 **Complete Malagasy Bible** - All 66 books with both Old and New Testament
- 🔍 **Advanced Search** - Fast, accurate search with filters and highlighting
- 🎲 **Random Verses** - Discover inspiring verses daily
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Reading Modes** - Optimized for different reading preferences

### Technical Excellence
- ⚡ **High Performance** - Server-side rendering with caching
- 🔒 **Security First** - Comprehensive security headers and validation
- 🧪 **100% Test Coverage** - Unit, integration, and E2E tests
- 📊 **Monitoring** - Performance and error tracking
- 🏗️ **Clean Architecture** - Repository pattern with SOLID principles

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ny-baiboly.git
cd ny-baiboly

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Lint and fix code
pnpm lint:check       # Check linting without fixing
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI

# Utilities
pnpm clean            # Clean build artifacts
pnpm analyze          # Analyze bundle size
pnpm security:audit   # Security audit
```

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                      # Next.js 15 App Router
│   ├── (routes)/            # Route groups
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # Reusable components
│   ├── bible/              # Bible-specific components
│   ├── ui/                 # Base UI components
│   └── layout.tsx          # Layout components
├── lib/                    # Core business logic
│   ├── bible-repository.ts  # Data access layer
│   ├── cache.ts            # Caching system
│   ├── errors.ts           # Error handling
│   └── __tests__/          # Unit tests
├── types/                  # TypeScript type definitions
├── config/                 # Configuration management
├── constants/              # Application constants
├── utils/                  # Utility functions
└── hooks/                  # Custom React hooks

data/
└── baiboly-json/           # Bible data files
    ├── Testameta taloha/   # Old Testament
    └── Testameta vaovao/   # New Testament

e2e/                        # End-to-end tests
__tests__/                  # Additional test files
```

For complete documentation, architecture details, testing strategies, and deployment guides, see our comprehensive documentation above.
