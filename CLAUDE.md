# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page React application showcasing Playwright command comparisons across MCP Tools, CLI Skills, and Test Runner. Built with Vite for fast development and simple deployment. The app is entirely client-side with no backend dependencies.

## Essential Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production (output to /dist)
npm run preview      # Preview production build locally
```

## Architecture

### Component Structure
- **Single Component App**: All logic in `src/App.jsx` (~1100 lines)
- **No component decomposition**: Entire UI is one React component with inline JSX
- **Data-driven rendering**: Command categories defined in static data structure at top of App.jsx
- **No routing**: Single-page view with conditional rendering based on state

### Data Model
The app renders from the `categories` array (lines 3-121 in App.jsx):
- Each category has: name, icon, color, accent, tip, commands[]
- Each command has: action, mcp, cli, test, hot (boolean)
- Commands marked with `hot: true` display a red dot indicator for frequently-used commands

### State Management
Pure React `useState` hooks, no external state library:
- `activeCat`: Currently selected category index
- `search`: Search filter string
- `view`: Toggle between "category" or "all" view modes
- `showComparison`: Toggle MCP vs CLI comparison table
- `loaded`: Animation trigger on mount

### Styling
- **All styles inline**: Embedded in `<style>` tag within App.jsx (lines 170-845)
- **CSS custom properties**: Color palette defined in `:root`
- **No CSS modules or styled-components**: Everything in one style block
- **Responsive breakpoints**: Single mobile breakpoint at 768px

## Key Patterns

### Adding New Commands
To add a command to an existing category, locate the category in the `categories` array and add to its `commands` array:
```js
{
  action: "Your Action Name",
  mcp: "mcp_tool_name",     // or "—" if not available
  cli: "cli command",        // or "—" if not available
  test: "npx playwright ...", // or "—" if not available
  hot: true                   // optional, adds red dot indicator
}
```

### Adding New Categories
Insert a new object into the `categories` array with the same structure:
```js
{
  name: "Category Name",
  icon: "🎯",
  color: "#hexcolor",        // primary category color
  accent: "#hexcolor",       // lighter accent for backgrounds
  tip: "Pro tip text shown above category table",
  commands: [/* command objects */]
}
```

### Search Functionality
Search filters across all fields (action, mcp, cli, test) using case-insensitive substring matching (lines 160-164).

### Adding New Workflows
To add a workflow example, insert a new object into the `workflows` array (after line 121):
```js
{
  id: "unique-workflow-id",  // kebab-case identifier
  name: "Workflow Name",
  icon: "🎯",
  description: "Brief description of what this workflow demonstrates",
  difficulty: "beginner",     // or "intermediate", "advanced"
  category: "authentication", // or "forms", "ecommerce", "api", etc.
  mcp: {
    description: "Using MCP tools for AI-driven testing",
    code: `// Step-by-step MCP commands
browser_navigate({ url: "..." })
browser_type({ text: "...", description: "field description" })`
  },
  cli: {
    description: "Using CLI skills for lightweight automation",
    code: `# Step-by-step CLI commands
playwright open url
playwright fill #ref text`
  },
  testRunner: {
    description: "Using Test Runner for robust CI/CD testing",
    code: `import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  // Complete test code
});`
  },
  expectedResult: "What should happen when workflow completes",
  proTip: "Best practice or insight specific to this workflow"
}
```

### Workflow Interaction State
Additional state hooks for workflow examples:
- `expandedWorkflow`: ID of currently expanded workflow (null if all collapsed)
- `workflowTab`: Object mapping workflow IDs to active tab ('mcp', 'cli', or 'testRunner')
- `copiedCode`: Object tracking copy button state per workflow (true for 2 seconds after copy)

Workflows default to collapsed and MCP tab selected on first expand.

## Deployment

This app is designed for static hosting:
- **Vercel**: Automatically detected as Vite project, zero config
- **Netlify**: Drop `/dist` folder after `npm run build`
- **GitHub Pages**: Set up GitHub Actions to build and deploy
- No server-side rendering, no API routes, no environment variables needed

## Important Notes

- All fonts are loaded from Google Fonts CDN (Playfair Display, Source Sans 3, IBM Plex Mono)
- Favicon is inline SVG emoji (no separate icon file)
- No test suite exists in this project
- The comparison data is separate from categories (see `comparisonData` array, lines 123-130)
- Animation delays are calculated dynamically based on index position for staggered reveals
