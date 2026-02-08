# Workflow Examples Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add complete end-to-end workflow examples showing MCP Tools, CLI Skills, and Test Runner in real-world scenarios

**Architecture:** Keep single-component design, add workflows data inline in App.jsx, implement expandable cards with tab switching, use plain CSS (no new dependencies initially)

**Tech Stack:** React 18, Vite, inline styles (maintaining existing architecture)

---

## Task 1: Create Workflow Data Structure

**Files:**
- Modify: `src/App.jsx:3` (add workflow data after categories array)

**Step 1: Add workflow data array**

Add this after the `categories` array (after line 121):

```javascript
const workflows = [
  {
    id: 1,
    name: "Login Authentication Flow",
    icon: "🔐",
    description: "Complete user login with credential validation and dashboard verification",
    difficulty: "beginner",
    category: "authentication",
    mcp: {
      description: "Using MCP tools for AI-driven testing",
      code: `// Step 1: Navigate to login page
browser_navigate("https://demo.playwright.dev/login")

// Step 2: Fill username field
browser_type("user@example.com", "Username input field")

// Step 3: Fill password field
browser_type("SecurePass123", "Password input field")

// Step 4: Click login button
browser_click("Login button")

// Step 5: Take snapshot to verify success
browser_snapshot() // Look for "Welcome" heading`
    },
    cli: {
      description: "Using CLI skills for lightweight automation",
      code: `# Step 1: Open login page
open https://demo.playwright.dev/login

# Step 2: Fill username
fill <username-input> user@example.com

# Step 3: Fill password
fill <password-input> SecurePass123

# Step 4: Click submit button
click <login-button>

# Step 5: Take snapshot
snapshot`
    },
    testRunner: {
      description: "Using Test Runner for robust CI/CD testing",
      code: `import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://demo.playwright.dev/login');

  // Step 2: Fill credentials
  await page.fill('[data-testid="username"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123');

  // Step 3: Click login button
  await page.click('[data-testid="login-button"]');

  // Step 4: Wait for navigation
  await page.waitForURL('**/dashboard');

  // Step 5: Verify dashboard elements
  await expect(page.locator('h1')).toContainText('Welcome');
  await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
});`
    },
    expectedResult: "User redirected to dashboard, welcome message and profile icon visible",
    proTip: "MCP uses accessibility snapshots to find elements, CLI uses snapshot refs, Test Runner uses data-testid selectors for reliability"
  },
  {
    id: 2,
    name: "Form Validation Testing",
    icon: "📝",
    description: "Test form validation by submitting invalid data, then correcting and resubmitting",
    difficulty: "intermediate",
    category: "forms",
    mcp: {
      description: "Using MCP tools for AI-driven testing",
      code: `// Step 1: Navigate to form
browser_navigate("https://demo.playwright.dev/register")

// Step 2: Fill invalid email
browser_type("invalid-email", "Email input field")

// Step 3: Fill weak password
browser_type("123", "Password input field")

// Step 4: Submit form
browser_click("Submit button")

// Step 5: Verify error messages
browser_snapshot() // Check for error messages

// Step 6: Correct email
browser_type("user@example.com", "Email input field")

// Step 7: Correct password
browser_type("SecurePass123!", "Password input field")

// Step 8: Submit again
browser_click("Submit button")

// Step 9: Verify success
browser_snapshot() // Check for success message`
    },
    cli: {
      description: "Using CLI skills for lightweight automation",
      code: `# Step 1: Open registration form
open https://demo.playwright.dev/register

# Step 2: Fill invalid email
fill <email-input> invalid-email

# Step 3: Fill weak password
fill <password-input> 123

# Step 4: Submit form
click <submit-button>

# Step 5: Take snapshot to see errors
snapshot

# Step 6: Correct email
fill <email-input> user@example.com

# Step 7: Correct password
fill <password-input> SecurePass123!

# Step 8: Submit again
click <submit-button>

# Step 9: Verify success
snapshot`
    },
    testRunner: {
      description: "Using Test Runner for robust CI/CD testing",
      code: `import { test, expect } from '@playwright/test';

test('form shows validation errors and accepts valid data', async ({ page }) => {
  // Step 1: Navigate to form
  await page.goto('https://demo.playwright.dev/register');

  // Step 2: Fill invalid data
  await page.fill('[data-testid="email"]', 'invalid-email');
  await page.fill('[data-testid="password"]', '123');

  // Step 3: Submit form
  await page.click('[data-testid="submit"]');

  // Step 4: Verify error messages appear
  await expect(page.locator('[data-testid="email-error"]'))
    .toContainText('Please enter a valid email');
  await expect(page.locator('[data-testid="password-error"]'))
    .toContainText('Password must be at least 8 characters');

  // Step 5: Correct the data
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');

  // Step 6: Submit again
  await page.click('[data-testid="submit"]');

  // Step 7: Verify success
  await expect(page.locator('[data-testid="success-message"]'))
    .toContainText('Registration successful');
});`
    },
    expectedResult: "Form shows validation errors for invalid input, accepts valid data and shows success message",
    proTip: "Test both failure and success paths. MCP and CLI require manual verification, Test Runner uses assertions for automated validation"
  },
  {
    id: 3,
    name: "E-commerce Product Search",
    icon: "🛒",
    description: "Search for a product, verify results, and add item to cart",
    difficulty: "intermediate",
    category: "ecommerce",
    mcp: {
      description: "Using MCP tools for AI-driven testing",
      code: `// Step 1: Navigate to store
browser_navigate("https://demo.playwright.dev/store")

// Step 2: Type in search box
browser_type("laptop", "Search input field")

// Step 3: Press Enter
browser_press_key("Enter")

// Step 4: Verify results loaded
browser_snapshot() // Check for product listings

// Step 5: Click first product
browser_click("First product in search results")

// Step 6: Verify product page
browser_snapshot() // Check product details

// Step 7: Click Add to Cart
browser_click("Add to Cart button")

// Step 8: Verify cart updated
browser_snapshot() // Check cart badge shows "1"`
    },
    cli: {
      description: "Using CLI skills for lightweight automation",
      code: `# Step 1: Open store
open https://demo.playwright.dev/store

# Step 2: Search for product
fill <search-input> laptop

# Step 3: Press Enter
press Enter

# Step 4: Take snapshot of results
snapshot

# Step 5: Click first product
click <first-product>

# Step 6: Verify product page
snapshot

# Step 7: Add to cart
click <add-to-cart>

# Step 8: Check cart count
snapshot`
    },
    testRunner: {
      description: "Using Test Runner for robust CI/CD testing",
      code: `import { test, expect } from '@playwright/test';

test('user can search and add product to cart', async ({ page }) => {
  // Step 1: Navigate to store
  await page.goto('https://demo.playwright.dev/store');

  // Step 2: Search for product
  await page.fill('[data-testid="search"]', 'laptop');
  await page.press('[data-testid="search"]', 'Enter');

  // Step 3: Wait for results to load
  await page.waitForSelector('[data-testid="product-list"]');

  // Step 4: Verify search results
  const products = page.locator('[data-testid="product-item"]');
  await expect(products).toHaveCount(expect.greaterThan(0));

  // Step 5: Click first product
  await products.first().click();

  // Step 6: Verify product page loaded
  await expect(page.locator('h1[data-testid="product-title"]'))
    .toBeVisible();

  // Step 7: Add to cart
  await page.click('[data-testid="add-to-cart"]');

  // Step 8: Verify cart badge updated
  await expect(page.locator('[data-testid="cart-badge"]'))
    .toContainText('1');
});`
    },
    expectedResult: "Product search returns results, product page loads, cart count increases to 1",
    proTip: "Use waitForSelector with Test Runner to handle dynamic content. MCP's browser_snapshot provides page state for AI verification"
  }
];
```

**Step 2: Verify data structure**

Check that the array is properly closed and positioned after `categories` array.

Expected: No syntax errors, workflows array accessible in component.

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add workflows data structure with 3 example workflows"
```

---

## Task 2: Add Workflow Section Styles

**Files:**
- Modify: `src/App.jsx:734` (add styles before .footer-bar)

**Step 1: Add workflow section CSS**

Add these styles in the `<style>` block before `.footer-bar`:

```css
        .workflows-section {
          margin-top: 48px;
          margin-bottom: 40px;
        }

        .workflow-card {
          background: white;
          border: 1.5px solid var(--warm-tan);
          border-radius: 16px;
          margin-bottom: 20px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .workflow-card:hover {
          box-shadow: 0 8px 28px rgba(139,111,71,0.12);
        }

        .workflow-header {
          padding: 20px 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, var(--warm-cream), white);
          border-bottom: 1.5px solid var(--warm-tan);
          transition: background 0.2s;
        }

        .workflow-header:hover {
          background: linear-gradient(135deg, var(--warm-sand), var(--warm-cream));
        }

        .workflow-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .workflow-icon {
          font-size: 28px;
        }

        .workflow-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--warm-dark);
          margin: 0;
        }

        .workflow-description {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          color: var(--warm-muted);
          margin: 4px 0 0 0;
        }

        .workflow-difficulty {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 4px 10px;
          border-radius: 100px;
          background: var(--warm-sand);
          color: var(--warm-brown);
        }

        .workflow-expand-icon {
          font-size: 20px;
          color: var(--warm-muted);
          transition: transform 0.3s;
        }

        .workflow-expand-icon.expanded {
          transform: rotate(180deg);
        }

        .workflow-content {
          padding: 24px;
        }

        .workflow-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--warm-tan);
          padding-bottom: 0;
        }

        .workflow-tab {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 20px;
          border: none;
          background: transparent;
          color: var(--warm-muted);
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s;
          position: relative;
          bottom: -2px;
        }

        .workflow-tab:hover {
          background: var(--warm-sand);
        }

        .workflow-tab.active {
          color: var(--warm-dark);
          background: white;
          border-bottom: 2px solid var(--warm-dark);
        }

        .workflow-code-block {
          background: #f8f9fa;
          border: 1px solid var(--warm-tan);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          position: relative;
        }

        .workflow-code-header {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 12px;
          color: var(--warm-muted);
          margin-bottom: 12px;
          font-style: italic;
        }

        .workflow-code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          line-height: 1.7;
          color: var(--warm-dark);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .workflow-copy-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--warm-tan);
          background: white;
          color: var(--warm-brown);
          cursor: pointer;
          transition: all 0.2s;
        }

        .workflow-copy-btn:hover {
          background: var(--warm-sand);
          border-color: var(--warm-brown);
        }

        .workflow-copy-btn.copied {
          background: #d1fae5;
          border-color: #34d399;
          color: #065f46;
        }

        .workflow-footer {
          display: flex;
          gap: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--warm-tan);
          flex-wrap: wrap;
        }

        .workflow-result,
        .workflow-tip {
          flex: 1;
          min-width: 250px;
        }

        .workflow-label {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--warm-brown);
          margin-bottom: 6px;
        }

        .workflow-text {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          color: var(--warm-text);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .workflow-header-left {
            flex-direction: column;
            align-items: flex-start;
          }
          .workflow-tabs {
            flex-direction: column;
            gap: 4px;
          }
          .workflow-tab {
            border-radius: 8px;
            width: 100%;
          }
          .workflow-tab.active {
            border-bottom: none;
            background: var(--warm-sand);
          }
          .workflow-footer {
            flex-direction: column;
          }
        }
```

**Step 2: Verify styles render**

Check that styles are added inside the `<style>` tag and before `.footer-bar`.

Expected: No syntax errors, styles block properly closed.

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "style: add workflow section CSS styles"
```

---

## Task 3: Add Workflow Section Component Logic

**Files:**
- Modify: `src/App.jsx:147-167` (inside PlaywrightWarmCheatsheet component)

**Step 1: Add workflow state variables**

Add these state hooks after existing useState declarations (around line 152):

```javascript
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);
  const [workflowTab, setWorkflowTab] = useState({});
  const [copiedCode, setCopiedCode] = useState({});
```

**Step 2: Add copy code handler**

Add this function before the return statement (around line 167):

```javascript
  const handleCopyCode = (workflowId, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(prev => ({ ...prev, [workflowId]: true }));
    setTimeout(() => {
      setCopiedCode(prev => ({ ...prev, [workflowId]: false }));
    }, 2000);
  };

  const getActiveTab = (workflowId) => workflowTab[workflowId] || 'mcp';
  const setActiveTab = (workflowId, tab) => {
    setWorkflowTab(prev => ({ ...prev, [workflowId]: tab }));
  };
```

**Step 3: Verify logic added**

Check that functions are before return statement and state hooks are with other useState calls.

Expected: No syntax errors, functions accessible in JSX.

**Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add workflow expand/collapse and copy logic"
```

---

## Task 4: Add Workflow Section JSX

**Files:**
- Modify: `src/App.jsx:1053` (after setup-grid, before footer)

**Step 1: Add workflows section JSX**

Add this after the setup cards section (before `</div>` that closes `.warm-container`):

```jsx
        {/* WORKFLOWS SECTION */}
        <div className="workflows-section">
          <div className="section-heading">
            <span>💼</span> Complete Workflow Examples
            <span className="section-count">{workflows.length}</span>
          </div>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 14,
            color: 'var(--warm-muted)',
            marginBottom: 24,
            lineHeight: 1.6
          }}>
            Real-world test scenarios showing how MCP, CLI, and Test Runner work together step-by-step.
          </p>

          {workflows.map(workflow => (
            <div key={workflow.id} className="workflow-card">
              <div
                className="workflow-header"
                onClick={() => setExpandedWorkflow(
                  expandedWorkflow === workflow.id ? null : workflow.id
                )}
              >
                <div className="workflow-header-left">
                  <span className="workflow-icon">{workflow.icon}</span>
                  <div>
                    <h3 className="workflow-title">{workflow.name}</h3>
                    <p className="workflow-description">{workflow.description}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="workflow-difficulty">{workflow.difficulty}</span>
                  <span className={`workflow-expand-icon ${expandedWorkflow === workflow.id ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {expandedWorkflow === workflow.id && (
                <div className="workflow-content">
                  <div className="workflow-tabs">
                    <button
                      className={`workflow-tab ${getActiveTab(workflow.id) === 'mcp' ? 'active' : ''}`}
                      onClick={() => setActiveTab(workflow.id, 'mcp')}
                    >
                      🤖 MCP Tools
                    </button>
                    <button
                      className={`workflow-tab ${getActiveTab(workflow.id) === 'cli' ? 'active' : ''}`}
                      onClick={() => setActiveTab(workflow.id, 'cli')}
                    >
                      ⚡ CLI Skills
                    </button>
                    <button
                      className={`workflow-tab ${getActiveTab(workflow.id) === 'testRunner' ? 'active' : ''}`}
                      onClick={() => setActiveTab(workflow.id, 'testRunner')}
                    >
                      🧪 Test Runner
                    </button>
                  </div>

                  <div className="workflow-code-block">
                    <div className="workflow-code-header">
                      {workflow[getActiveTab(workflow.id)].description}
                    </div>
                    <pre className="workflow-code">
                      {workflow[getActiveTab(workflow.id)].code}
                    </pre>
                    <button
                      className={`workflow-copy-btn ${copiedCode[workflow.id] ? 'copied' : ''}`}
                      onClick={() => handleCopyCode(workflow.id, workflow[getActiveTab(workflow.id)].code)}
                    >
                      {copiedCode[workflow.id] ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <div className="workflow-footer">
                    <div className="workflow-result">
                      <div className="workflow-label">✅ Expected Result</div>
                      <div className="workflow-text">{workflow.expectedResult}</div>
                    </div>
                    <div className="workflow-tip">
                      <div className="workflow-label">💡 Pro Tip</div>
                      <div className="workflow-text">{workflow.proTip}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
```

**Step 2: Test in browser**

Run: `npm run dev`
Expected: Workflows section appears after Quick Setup, cards are collapsible, tabs switch content.

**Step 3: Verify functionality**

- Click workflow headers to expand/collapse
- Click tabs to switch between MCP/CLI/Test Runner
- Click Copy button and verify "✓ Copied!" appears
- Check responsive design on mobile width

Expected: All interactions work smoothly, no console errors.

**Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add workflow section JSX with expand/collapse and tabs"
```

---

## Task 5: Update Stats Section

**Files:**
- Modify: `src/App.jsx:889-907` (stats row section)

**Step 1: Add workflow count to stats**

Replace the existing stat-row div with:

```jsx
        <div className="stat-row" style={{
          animation: loaded ? "slideReveal 0.7s ease-out 0.15s both" : "none",
        }}>
          {[
            { n: totalMCP, label: "MCP Tools", color: "#4f46e5", border: "#c7d2fe" },
            { n: totalCLI, label: "CLI Skills", color: "#059669", border: "#a7f3d0" },
            { n: totalTest, label: "Test Runner", color: "#d97706", border: "#fcd34d" },
            { n: workflows.length, label: "Workflows", color: "#9f1239", border: "#fecdd3" },
          ].map((s, i) => (
            <div className="stat-box" key={i} style={{ "--top-color": s.color }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "14px 14px 0 0" }} />
              <div className="stat-number" style={{ color: s.color }}>
                <AnimatedNumber end={s.n} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
```

**Step 2: Test stat counter**

Run: `npm run dev`
Expected: Fourth stat box shows "3 Workflows" with animation.

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add workflow count to stats section"
```

---

## Task 6: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md:60` (add section after Key Patterns)

**Step 1: Add workflows documentation**

Add this section after "Adding New Categories":

```markdown
### Adding New Workflows
To add a workflow example, insert a new object into the `workflows` array (after line 121):
```js
{
  id: 4, // increment from last workflow
  name: "Workflow Name",
  icon: "🎯",
  description: "Brief description of what this workflow demonstrates",
  difficulty: "beginner", // or "intermediate", "advanced"
  category: "authentication", // or "forms", "ecommerce", "api", etc.
  mcp: {
    description: "Using MCP tools for AI-driven testing",
    code: `// Step-by-step MCP commands
browser_navigate("url")
browser_type("text", "field description")`
  },
  cli: {
    description: "Using CLI skills for lightweight automation",
    code: `# Step-by-step CLI commands
open url
type <ref> text`
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
- `expandedWorkflow`: ID of currently expanded workflow (null if all collapsed)
- `workflowTab`: Object mapping workflow IDs to active tab ('mcp', 'cli', or 'testRunner')
- `copiedCode`: Object tracking copy button state per workflow

Workflows default to collapsed and MCP tab selected.
```

**Step 2: Verify documentation is clear**

Read the updated CLAUDE.md to ensure instructions are complete.

Expected: Future developers can add workflows following this guide.

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add workflow examples documentation to CLAUDE.md"
```

---

## Task 7: Update README

**Files:**
- Modify: `README.md:37` (update What's Inside section)

**Step 1: Add workflows to feature list**

Update the "What's Inside" section:

```markdown
## 📋 What's Inside

- **50+ Commands** — Navigation, Interactions, Capture, Tabs, DevTools, Testing
- **3 Complete Workflows** — Real-world examples with step-by-step code
- **Side-by-Side Comparison** — MCP, CLI, and Test Runner for every command
- **Quick Setup Guide** — Get started in 30 seconds
- **Interactive Examples** — Expandable workflow cards with copy-to-clipboard
```

**Step 2: Verify README accuracy**

Check that feature count matches implementation (3 workflows).

Expected: README accurately describes new features.

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README with workflow examples feature"
```

---

## Task 8: Test Complete Feature

**Files:**
- None (manual testing)

**Step 1: Visual testing**

Run: `npm run dev`

Test checklist:
- [ ] Workflows section appears after Quick Setup
- [ ] Stats show "3 Workflows" with animation
- [ ] Three workflow cards render with correct icons
- [ ] Cards start collapsed
- [ ] Clicking header expands/collapses card
- [ ] MCP tab selected by default
- [ ] Tab switching works (MCP → CLI → Test Runner)
- [ ] Code displays correctly with proper formatting
- [ ] Copy button shows "📋 Copy" initially
- [ ] Clicking copy shows "✓ Copied!" for 2 seconds
- [ ] Expected Result and Pro Tip sections render
- [ ] Mobile responsive (test at 768px width)

**Step 2: Browser testing**

Test in:
- Chrome
- Firefox
- Safari (if on macOS)

Expected: All functionality works consistently across browsers.

**Step 3: Document any issues**

If bugs found, document in a TODO comment or fix immediately.

Expected: Feature works smoothly, no console errors.

---

## Task 9: Build and Preview

**Files:**
- None (build command)

**Step 1: Build for production**

Run: `npm run build`

Expected: Build completes without errors, `/dist` folder created.

**Step 2: Preview production build**

Run: `npm run preview`

Expected: Production build works identically to dev mode.

**Step 3: Check bundle size**

Run: `ls -lh dist/assets/*.js`

Expected: JavaScript bundle under 200KB (no heavy dependencies added).

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify production build works correctly"
```

---

## Implementation Complete

**Summary of Changes:**
- Added 3 complete workflow examples (Login, Form Validation, E-commerce)
- Implemented expandable workflow cards with tab switching
- Added copy-to-clipboard functionality
- Updated stats section to show workflow count
- Updated documentation (CLAUDE.md and README.md)
- No external dependencies added (pure React + inline styles)

**Files Modified:**
- `src/App.jsx` (workflows data, styles, component logic, JSX)
- `CLAUDE.md` (workflow documentation)
- `README.md` (feature list)

**Files Created:**
- `docs/plans/2026-02-08-workflow-examples.md` (this plan)

**What's Next (Future Enhancements):**
- Add more workflows (Multi-tab, API Mocking)
- Add syntax highlighting library for prettier code
- Add filter by difficulty/category
- Add search integration for workflows
- Add video/GIF demonstrations

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-02-08-workflow-examples.md`.**

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
