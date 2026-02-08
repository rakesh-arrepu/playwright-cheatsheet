import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Custom warm editorial syntax theme
const warmCodeTheme = {
  'code[class*="language-"]': {
    color: '#3d2b1f',
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    fontSize: '13.5px',
    lineHeight: '1.75',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '2',
    OTabSize: '2',
    tabSize: '2',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#3d2b1f',
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    fontSize: '13.5px',
    lineHeight: '1.75',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '2',
    OTabSize: '2',
    tabSize: '2',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '24px',
    margin: '0',
    overflow: 'auto',
    background: 'linear-gradient(135deg, #fdfcfb 0%, #faf8f5 100%)',
    borderRadius: '10px',
  },
  'comment': { color: '#a89984', fontStyle: 'italic' },
  'prolog': { color: '#a89984' },
  'doctype': { color: '#a89984' },
  'cdata': { color: '#a89984' },
  'punctuation': { color: '#8b6f47' },
  'property': { color: '#b45309' },
  'tag': { color: '#b45309' },
  'boolean': { color: '#c2410c' },
  'number': { color: '#c2410c' },
  'constant': { color: '#c2410c' },
  'symbol': { color: '#c2410c' },
  'deleted': { color: '#dc2626' },
  'selector': { color: '#3f6212' },
  'attr-name': { color: '#3f6212' },
  'string': { color: '#3f6212', fontWeight: '500' },
  'char': { color: '#3f6212' },
  'builtin': { color: '#065f46' },
  'inserted': { color: '#059669' },
  'operator': { color: '#78350f' },
  'entity': { color: '#78350f', cursor: 'help' },
  'url': { color: '#78350f' },
  'variable': { color: '#92400e' },
  'atrule': { color: '#6b21a8' },
  'attr-value': { color: '#3f6212', fontWeight: '500' },
  'keyword': { color: '#6b21a8', fontWeight: '600' },
  'function': { color: '#1e40af', fontWeight: '600' },
  'class-name': { color: '#1e40af', fontWeight: '600' },
  'regex': { color: '#c2410c' },
  'important': { color: '#dc2626', fontWeight: 'bold' },
};

const categories = [
  {
    name: "Navigation",
    icon: "🧭",
    color: "#b45309",
    accent: "#fef3c7",
    tip: "MCP uses browser_navigate with accessibility snapshots; CLI keeps sessions alive for multi-step flows.",
    commands: [
      { action: "Open / Navigate URL", mcp: "browser_navigate", cli: "open <url>", test: "npx playwright test", hot: true },
      { action: "Go Back", mcp: "browser_navigate_back", cli: "go-back", test: "—" },
      { action: "Go Forward", mcp: "browser_navigate_forward", cli: "go-forward", test: "—" },
      { action: "Reload Page", mcp: "—", cli: "reload", test: "—" },
      { action: "Close Browser", mcp: "browser_close", cli: "close", test: "—" },
    ],
  },
  {
    name: "Interactions",
    icon: "🖱️",
    color: "#9f1239",
    accent: "#ffe4e6",
    tip: "MCP requires element ref + human-readable description for safety. CLI uses snapshot refs directly.",
    commands: [
      { action: "Click Element", mcp: "browser_click", cli: "click <ref>", test: "—", hot: true },
      { action: "Double Click", mcp: "—", cli: "dblclick <ref>", test: "—" },
      { action: "Type Text", mcp: "browser_type", cli: "type <text>", test: "—", hot: true },
      { action: "Fill Input", mcp: "—", cli: "fill <ref> <text>", test: "—" },
      { action: "Hover Element", mcp: "browser_hover", cli: "hover <ref>", test: "—" },
      { action: "Drag & Drop", mcp: "browser_drag", cli: "drag <start> <end>", test: "—" },
      { action: "Select Option", mcp: "browser_select_option", cli: "select <ref> <val>", test: "—" },
      { action: "Check / Uncheck", mcp: "—", cli: "check / uncheck <ref>", test: "—" },
      { action: "Press Key", mcp: "browser_press_key", cli: "press <key>", test: "—", hot: true },
    ],
  },
  {
    name: "Capture & Snapshot",
    icon: "📸",
    color: "#1e40af",
    accent: "#dbeafe",
    tip: "browser_snapshot is THE workhorse of MCP — it returns structured accessibility trees, not pixels.",
    commands: [
      { action: "Page Snapshot", mcp: "browser_snapshot", cli: "snapshot", test: "—", hot: true },
      { action: "Take Screenshot", mcp: "browser_take_screenshot", cli: "screenshot [ref]", test: "--screenshot", hot: true },
      { action: "Save as PDF", mcp: "browser_pdf_save", cli: "pdf", test: "npx playwright pdf <url>" },
      { action: "Resize Viewport", mcp: "browser_resize", cli: "resize <w> <h>", test: "--viewport-size=WxH" },
    ],
  },
  {
    name: "Tab Management",
    icon: "📑",
    color: "#065f46",
    accent: "#d1fae5",
    tip: "Multi-tab orchestration is key for comparing pages, A/B testing, or parallel form filling workflows.",
    commands: [
      { action: "List Tabs", mcp: "browser_tab_list", cli: "tab-list", test: "—" },
      { action: "New Tab", mcp: "browser_tab_new", cli: "tab-new [url]", test: "—" },
      { action: "Select Tab", mcp: "browser_tab_select", cli: "tab-select <idx>", test: "—" },
      { action: "Close Tab", mcp: "browser_tab_close", cli: "tab-close [idx]", test: "—" },
    ],
  },
  {
    name: "DevTools & Debug",
    icon: "🛠️",
    color: "#7c2d12",
    accent: "#fed7aa",
    tip: "Console & network tools in MCP help AI agents self-diagnose failures without human intervention.",
    commands: [
      { action: "Console Messages", mcp: "browser_console_messages", cli: "console [level]", test: "—", hot: true },
      { action: "Network Requests", mcp: "browser_network_requests", cli: "network", test: "—", hot: true },
      { action: "Handle Dialog", mcp: "browser_handle_dialog", cli: "dialog-accept / dismiss", test: "—" },
      { action: "File Upload", mcp: "browser_file_upload", cli: "upload <file>", test: "—" },
      { action: "Run JS / Eval", mcp: "—", cli: "eval <func> [ref]", test: "—" },
      { action: "Run Code Snippet", mcp: "—", cli: "run-code <code>", test: "—" },
    ],
  },
  {
    name: "Testing & Codegen",
    icon: "🧪",
    color: "#6b21a8",
    accent: "#f3e8ff",
    tip: "MCP generates tests from live browser state. Test Runner is the gold standard for CI/CD pipelines.",
    commands: [
      { action: "Generate Test", mcp: "browser_generate_playwright_test", cli: "—", test: "npx playwright codegen", hot: true },
      { action: "Run All Tests", mcp: "—", cli: "—", test: "npx playwright test", hot: true },
      { action: "Run Headed", mcp: "—", cli: "open <url> --headed", test: "npx playwright test --headed" },
      { action: "Debug Mode", mcp: "—", cli: "—", test: "npx playwright test --debug" },
      { action: "UI Mode", mcp: "—", cli: "—", test: "npx playwright test --ui", hot: true },
      { action: "Show Report", mcp: "—", cli: "—", test: "npx playwright show-report", hot: true },
      { action: "Show Trace", mcp: "—", cli: "tracing-start / stop", test: "npx playwright show-trace" },
      { action: "Wait For", mcp: "browser_wait_for", cli: "—", test: "—" },
      { action: "Install Browsers", mcp: "browser_install", cli: "—", test: "npx playwright install" },
    ],
  },
  {
    name: "Sessions (CLI)",
    icon: "🔧",
    color: "#475569",
    accent: "#e2e8f0",
    tip: "CLI sessions persist cookies & state between calls — perfect for multi-step agent workflows.",
    commands: [
      { action: "List Sessions", mcp: "—", cli: "session-list", test: "—" },
      { action: "Stop Session", mcp: "—", cli: "session-stop [name]", test: "—" },
      { action: "Stop All Sessions", mcp: "—", cli: "session-stop-all", test: "—" },
      { action: "Delete Session", mcp: "—", cli: "session-delete [name]", test: "—" },
    ],
  },
  {
    name: "Mouse & Keys (CLI)",
    icon: "🖲️",
    color: "#374151",
    accent: "#f3f4f6",
    tip: "Fine-grained mouse/keyboard control is CLI-only — great for canvas apps, games, or drag interactions.",
    commands: [
      { action: "Mouse Move", mcp: "—", cli: "mousemove <x> <y>", test: "—" },
      { action: "Mouse Down / Up", mcp: "—", cli: "mousedown / mouseup", test: "—" },
      { action: "Mouse Wheel", mcp: "—", cli: "mousewheel <dx> <dy>", test: "—" },
      { action: "Key Down / Up", mcp: "—", cli: "keydown / keyup <key>", test: "—" },
    ],
  },
];

const workflows = [
  {
    id: "login-auth",
    name: "Login Authentication Flow",
    icon: "🔐",
    description: "Complete end-to-end login test covering navigation, form interaction, and post-login verification",
    difficulty: "beginner",
    category: "authentication",
    mcp: {
      description: "MCP uses accessibility snapshots to understand page state, then chains browser_navigate → browser_type → browser_click → browser_snapshot for verification.",
      code: `// Step 1: Navigate to login page
browser_navigate({
  url: "https://example.com/login"
})

// Step 2: Fill username (MCP auto-detects input fields from snapshot)
browser_type({
  text: "testuser@example.com",
  description: "email input field"
})

// Step 3: Fill password
browser_type({
  text: "SecurePass123!",
  description: "password input field"
})

// Step 4: Click login button
browser_click({
  description: "login submit button"
})

// Step 5: Verify successful login
browser_snapshot()
// AI agent verifies "Welcome" or dashboard elements in snapshot`
    },
    cli: {
      description: "CLI uses snapshot references (ref IDs) for element targeting. Requires one initial snapshot, then direct interactions.",
      code: `# Step 1: Open page and get initial snapshot
playwright open https://example.com/login
playwright snapshot

# Step 2: Type in email field (use ref from snapshot, e.g., #12)
playwright fill #12 "testuser@example.com"

# Step 3: Type in password field (ref #13)
playwright fill #13 "SecurePass123!"

# Step 4: Click login button (ref #14)
playwright click #14

# Step 5: Wait and verify
playwright snapshot
# Check output for success indicators`
    },
    testRunner: {
      description: "Test Runner provides full assertion library, automatic waiting, and retry logic. Most robust for CI/CD.",
      code: `import { test, expect } from '@playwright/test';

test('login authentication flow', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://example.com/login');

  // Step 2: Fill email field
  await page.fill('input[type="email"]', 'testuser@example.com');

  // Step 3: Fill password field
  await page.fill('input[type="password"]', 'SecurePass123!');

  // Step 4: Click login button
  await page.click('button[type="submit"]');

  // Step 5: Assert successful login
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('.welcome-message')).toBeVisible();
  await expect(page.locator('.user-avatar')).toContainText('testuser');
});`
    },
    expectedResult: "User successfully logs in and lands on dashboard with welcome message visible",
    proTip: "MCP excels when field labels change (uses AI understanding). CLI is fastest for stable UIs. Test Runner is most reliable for regression suites."
  },
  {
    id: "form-validation",
    name: "Form Validation Testing",
    icon: "📝",
    description: "Testing client-side form validation by intentionally triggering error states and verifying messages",
    difficulty: "intermediate",
    category: "forms",
    mcp: {
      description: "MCP can intelligently detect validation messages from accessibility tree without explicit selectors.",
      code: `// Step 1: Navigate to form
browser_navigate({
  url: "https://example.com/signup"
})

// Step 2: Submit empty form to trigger validation
browser_click({
  description: "submit button"
})

// Step 3: Capture validation state
browser_snapshot()
// AI reads "Email is required" from accessibility tree

// Step 4: Fill invalid email
browser_type({
  text: "not-an-email",
  description: "email input"
})

browser_click({
  description: "submit button"
})

// Step 5: Verify error message
browser_snapshot()
// AI confirms "Invalid email format" is present

// Step 6: Fix validation and submit
browser_type({
  text: "valid@example.com",
  description: "email input"
})

browser_type({
  text: "StrongPass123!",
  description: "password input"
})

browser_click({
  description: "submit button"
})

// Step 7: Verify success
browser_snapshot()
// AI confirms no error messages, success state visible`
    },
    cli: {
      description: "CLI requires explicit snapshot + ref workflow, but is very token-efficient for repeated validation checks.",
      code: `# Step 1: Open signup form
playwright open https://example.com/signup
playwright snapshot

# Step 2: Submit without filling (get submit button ref)
playwright click #20
playwright snapshot
# Manually check output for "Email is required"

# Step 3: Fill invalid email (get email field ref)
playwright fill #18 "not-an-email"
playwright click #20
playwright snapshot
# Check for "Invalid email format"

# Step 4: Fix validation
playwright fill #18 "valid@example.com"
playwright fill #19 "StrongPass123!"

# Step 5: Submit valid form
playwright click #20
playwright snapshot
# Verify success message or redirect`
    },
    testRunner: {
      description: "Test Runner provides explicit assertions for validation states, making tests self-documenting and reliable.",
      code: `import { test, expect } from '@playwright/test';

test('form validation flow', async ({ page }) => {
  // Step 1: Navigate to form
  await page.goto('https://example.com/signup');

  // Step 2: Submit empty form
  await page.click('button[type="submit"]');

  // Step 3: Assert validation errors appear
  await expect(page.locator('.error-email')).toHaveText('Email is required');
  await expect(page.locator('.error-password')).toHaveText('Password is required');

  // Step 4: Fill invalid email
  await page.fill('input[name="email"]', 'not-an-email');
  await page.click('button[type="submit"]');

  // Step 5: Assert invalid format error
  await expect(page.locator('.error-email')).toHaveText('Invalid email format');

  // Step 6: Fix validation
  await page.fill('input[name="email"]', 'valid@example.com');
  await page.fill('input[name="password"]', 'StrongPass123!');

  // Step 7: Submit valid form
  await page.click('button[type="submit"]');

  // Step 8: Assert success
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page).toHaveURL(/.*success/);
});`
    },
    expectedResult: "Form correctly shows validation errors for invalid inputs, then successfully submits when all fields are valid",
    proTip: "MCP is best for exploratory testing of validation logic. Test Runner provides explicit assertions that serve as living documentation."
  },
  {
    id: "ecommerce-search",
    name: "E-commerce Product Search",
    icon: "🛒",
    description: "Search for products, apply filters, verify results, and interact with product cards",
    difficulty: "intermediate",
    category: "ecommerce",
    mcp: {
      description: "MCP handles dynamic content well by re-snapshotting after filters/interactions. AI understands product card structure.",
      code: `// Step 1: Navigate to shop
browser_navigate({
  url: "https://example.com/shop"
})

// Step 2: Perform search
browser_type({
  text: "wireless headphones",
  description: "search input field"
})

browser_press_key({
  key: "Enter"
})

// Step 3: Wait and verify results loaded
browser_snapshot()
// AI confirms search results are visible

// Step 4: Apply price filter
browser_click({
  description: "price range $50-$100 checkbox"
})

// Step 5: Verify filtered results
browser_snapshot()
// AI verifies only products in price range are shown

// Step 6: Sort by rating
browser_select_option({
  description: "sort dropdown",
  value: "rating-high-to-low"
})

// Step 7: Click first product
browser_click({
  description: "first product card"
})

// Step 8: Verify product page
browser_snapshot()
// AI confirms product details page loaded with correct product`
    },
    cli: {
      description: "CLI workflow is efficient for fixed selectors. Good for performance testing or parallel search scenarios.",
      code: `# Step 1: Open shop page
playwright open https://example.com/shop
playwright snapshot

# Step 2: Search for product (get search input ref)
playwright fill #5 "wireless headphones"
playwright press Enter

# Step 3: Wait for results and snapshot
playwright snapshot

# Step 4: Apply price filter (get filter checkbox ref)
playwright check #15

# Step 5: Verify filters applied
playwright snapshot

# Step 6: Sort by rating (get dropdown ref)
playwright select #18 "rating-high-to-low"

# Step 7: Take screenshot of results
playwright screenshot

# Step 8: Click first product (get product card ref)
playwright click #22

# Step 9: Verify product page loaded
playwright snapshot`
    },
    testRunner: {
      description: "Test Runner excels at verifying dynamic lists, waiting for network requests, and asserting multiple conditions.",
      code: `import { test, expect } from '@playwright/test';

test('e-commerce product search flow', async ({ page }) => {
  // Step 1: Navigate to shop
  await page.goto('https://example.com/shop');

  // Step 2: Search for products
  await page.fill('input[type="search"]', 'wireless headphones');
  await page.press('input[type="search"]', 'Enter');

  // Step 3: Wait for results to load
  await page.waitForSelector('.product-card');
  const productCount = await page.locator('.product-card').count();
  expect(productCount).toBeGreaterThan(0);

  // Step 4: Apply price filter
  await page.check('input[name="price"][value="50-100"]');

  // Step 5: Verify filtered results
  await page.waitForLoadState('networkidle');
  const prices = await page.locator('.product-price').allTextContents();
  prices.forEach(price => {
    const value = parseFloat(price.replace('$', ''));
    expect(value).toBeGreaterThanOrEqual(50);
    expect(value).toBeLessThanOrEqual(100);
  });

  // Step 6: Sort by rating
  await page.selectOption('select[name="sort"]', 'rating-high-to-low');

  // Step 7: Verify sorting
  await page.waitForLoadState('networkidle');
  const ratings = await page.locator('.product-rating').allTextContents();
  // Verify descending order
  for (let i = 0; i < ratings.length - 1; i++) {
    expect(parseFloat(ratings[i])).toBeGreaterThanOrEqual(parseFloat(ratings[i + 1]));
  }

  // Step 8: Click first product
  await page.locator('.product-card').first().click();

  // Step 9: Verify product page
  await expect(page).toHaveURL(/.*\/product\/.*/);
  await expect(page.locator('h1.product-title')).toBeVisible();
  await expect(page.locator('.add-to-cart-btn')).toBeEnabled();
});`
    },
    expectedResult: "Search returns relevant products, filters work correctly, sorting is accurate, and product page loads with all details",
    proTip: "Use Test Runner for data validation (prices, ratings). MCP is great for visual verification. CLI is best for quick smoke tests."
  }
];

const comparisonData = [
  { aspect: "Token Efficiency", mcp: "Heavy — loads full tool schemas + snapshots", cli: "Lightweight — concise commands, minimal context", winner: "cli" },
  { aspect: "State Management", mcp: "Persistent browser context per MCP session", cli: "Named sessions with cookie/storage persistence", winner: "tie" },
  { aspect: "Best For", mcp: "Exploratory testing, self-healing, autonomous agents", cli: "High-throughput coding agents, CI pipelines", winner: "tie" },
  { aspect: "Setup Complexity", mcp: "Single JSON config in any MCP client", cli: "npm install + skill registration", winner: "mcp" },
  { aspect: "AI Agent Support", mcp: "Claude Desktop, Cursor, VS Code, Copilot", cli: "Claude Code, Copilot CLI, any terminal agent", winner: "tie" },
  { aspect: "Vision/Screenshot", mcp: "Optional (--caps=vision)", cli: "Built-in screenshot command", winner: "tie" },
];

function AnimatedNumber({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(end / 40));
    const id = setInterval(() => {
      n = Math.min(n + step, end);
      setVal(n);
      if (n >= end) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [end]);
  return <>{val}{suffix}</>;
}

export default function PlaywrightWarmCheatsheet() {
  const [activeCat, setActiveCat] = useState(0);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("category");
  const [loaded, setLoaded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);
  const [workflowTab, setWorkflowTab] = useState({});
  const [copiedCode, setCopiedCode] = useState({});

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const totalMCP = categories.reduce((a, c) => a + c.commands.filter(x => x.mcp !== "—").length, 0);
  const totalCLI = categories.reduce((a, c) => a + c.commands.filter(x => x.cli !== "—").length, 0);
  const totalTest = categories.reduce((a, c) => a + c.commands.filter(x => x.test !== "—").length, 0);

  const filtered = search
    ? categories.map(c => ({ ...c, commands: c.commands.filter(cmd =>
        [cmd.action, cmd.mcp, cmd.cli, cmd.test].some(v => v.toLowerCase().includes(search.toLowerCase()))
      ) })).filter(c => c.commands.length > 0)
    : categories;

  const displayCats = view === "all" || search ? filtered : [categories[activeCat]];

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

  const getCodeLanguage = (tab) => {
    if (tab === 'testRunner') return 'javascript';
    if (tab === 'cli') return 'bash';
    return 'javascript'; // MCP uses JavaScript-like syntax
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ee", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root {
          --warm-bg: #fdf6ee;
          --warm-cream: #faf0e4;
          --warm-sand: #f5e6d3;
          --warm-tan: #e8d5c0;
          --warm-brown: #8b6f47;
          --warm-dark: #3d2b1f;
          --warm-text: #4a3728;
          --warm-muted: #8a7565;
          --accent-terracotta: #c2410c;
          --accent-sage: #3f6212;
          --accent-navy: #1e3a5f;
          --accent-plum: #6b21a8;
          --accent-gold: #a16207;
        }

        * { box-sizing: border-box; }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }

        @keyframes slideReveal {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideFromLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes rowAppear {
          0% { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes warmPulse {
          0%, 100% { box-shadow: 0 2px 20px rgba(139,111,71,0.08); }
          50% { box-shadow: 0 4px 30px rgba(139,111,71,0.15); }
        }

        @keyframes tagShine {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes borderDance {
          0%, 100% { border-color: var(--warm-tan); }
          50% { border-color: var(--accent-terracotta); }
        }

        @keyframes countUp {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .warm-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .editorial-header {
          text-align: center;
          padding: 52px 28px 36px;
          position: relative;
        }

        .masthead-line {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-terracotta), var(--accent-gold));
          margin: 0 auto 20px;
          border-radius: 2px;
        }

        .masthead-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 42px;
          font-weight: 800;
          color: var(--warm-dark);
          letter-spacing: -1px;
          line-height: 1.15;
          margin: 0 0 6px;
        }

        .masthead-subtitle {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 400;
          font-style: italic;
          color: var(--warm-muted);
          margin: 0 0 16px;
        }

        .masthead-meta {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 12px;
          color: var(--warm-brown);
          text-transform: uppercase;
          letter-spacing: 2.5px;
          font-weight: 600;
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 8px 0 28px;
          color: var(--warm-tan);
          font-size: 14px;
        }

        .divider-ornament::before,
        .divider-ornament::after {
          content: '';
          height: 1px;
          width: 80px;
          background: linear-gradient(90deg, transparent, var(--warm-tan), transparent);
        }

        .stat-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .stat-box {
          background: white;
          border: 1px solid var(--warm-tan);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
        }

        .stat-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(139,111,71,0.12);
          border-color: var(--warm-brown);
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
        }

        .stat-label {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 6px;
          color: var(--warm-muted);
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 340px;
        }

        .search-box input {
          width: 100%;
          padding: 11px 16px 11px 40px;
          background: white;
          border: 1.5px solid var(--warm-tan);
          border-radius: 12px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 14px;
          color: var(--warm-dark);
          outline: none;
          transition: all 0.3s;
        }

        .search-box input:focus {
          border-color: var(--accent-terracotta);
          box-shadow: 0 0 0 3px rgba(194,65,12,0.08);
        }

        .search-box input::placeholder { color: #b8a898; }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          opacity: 0.45;
        }

        .view-pills {
          display: flex;
          background: white;
          border: 1.5px solid var(--warm-tan);
          border-radius: 12px;
          overflow: hidden;
        }

        .view-pill {
          padding: 10px 18px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--warm-muted);
          cursor: pointer;
          transition: all 0.25s;
          white-space: nowrap;
        }

        .view-pill.active {
          background: var(--warm-dark);
          color: var(--warm-cream);
        }

        .view-pill:not(.active):hover {
          background: var(--warm-sand);
        }

        .category-nav {
          display: flex;
          gap: 6px;
          margin-bottom: 22px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .cat-chip {
          padding: 9px 18px;
          border-radius: 100px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          border: 1.5px solid var(--warm-tan);
          background: white;
          color: var(--warm-muted);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          position: relative;
        }

        .cat-chip:hover {
          border-color: var(--warm-brown);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .cat-chip.active {
          background: var(--warm-dark);
          color: white;
          border-color: var(--warm-dark);
          box-shadow: 0 4px 16px rgba(61,43,31,0.2);
        }

        .pro-tip {
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border: 1px solid #fbbf24;
          border-left: 4px solid #d97706;
          border-radius: 0 12px 12px 0;
          padding: 14px 18px;
          margin-bottom: 18px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13.5px;
          color: #78350f;
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .pro-tip-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .table-wrapper {
          background: white;
          border: 1.5px solid var(--warm-tan);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 28px;
          animation: warmPulse 5s ease-in-out infinite;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1.3fr 1.5fr 1.3fr 1.9fr;
          padding: 14px 22px;
          background: linear-gradient(135deg, var(--warm-sand), var(--warm-cream));
          border-bottom: 1.5px solid var(--warm-tan);
        }

        .table-header-cell {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.3fr 1.5fr 1.3fr 1.9fr;
          padding: 13px 22px;
          border-bottom: 1px solid rgba(232,213,192,0.5);
          align-items: center;
          transition: all 0.2s;
        }

        .table-row:last-child { border-bottom: none; }

        .table-row:hover {
          background: linear-gradient(135deg, rgba(253,246,238,0.8), rgba(250,240,228,0.6));
        }

        .action-name {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--warm-dark);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hot-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239,68,68,0.4);
          flex-shrink: 0;
        }

        .tag-mcp {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 500;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          color: #3730a3;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #c7d2fe;
          transition: all 0.25s;
        }

        .tag-mcp:hover {
          border-color: #818cf8;
          box-shadow: 0 2px 8px rgba(99,102,241,0.15);
          transform: translateY(-1px);
        }

        .tag-cli {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 500;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          color: #065f46;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #a7f3d0;
          transition: all 0.25s;
        }

        .tag-cli:hover {
          border-color: #34d399;
          box-shadow: 0 2px 8px rgba(16,185,129,0.15);
          transform: translateY(-1px);
        }

        .tag-test {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 500;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          color: #92400e;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #fcd34d;
          transition: all 0.25s;
        }

        .tag-test:hover {
          border-color: #f59e0b;
          box-shadow: 0 2px 8px rgba(245,158,11,0.15);
          transform: translateY(-1px);
        }

        .tag-na {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          color: #c4b5a5;
          font-style: italic;
        }

        .section-heading {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--warm-dark);
          margin: 36px 0 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-count {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: white;
          background: var(--warm-brown);
          padding: 2px 10px;
          border-radius: 100px;
          letter-spacing: 0.5px;
        }

        .comparison-toggle {
          margin: 32px 0 20px;
          text-align: center;
        }

        .comparison-btn {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 14px;
          font-weight: 700;
          padding: 13px 32px;
          border-radius: 100px;
          border: 2px solid var(--warm-dark);
          background: transparent;
          color: var(--warm-dark);
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.5px;
        }

        .comparison-btn:hover {
          background: var(--warm-dark);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(61,43,31,0.2);
        }

        .comparison-table {
          background: white;
          border: 1.5px solid var(--warm-tan);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .comp-row {
          display: grid;
          grid-template-columns: 1.2fr 2fr 2fr 0.6fr;
          padding: 14px 22px;
          border-bottom: 1px solid rgba(232,213,192,0.5);
          align-items: center;
          transition: background 0.2s;
        }

        .comp-row:hover { background: var(--warm-cream); }
        .comp-row:last-child { border-bottom: none; }

        .winner-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Source Sans 3', sans-serif;
        }

        .setup-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .setup-card {
          background: white;
          border: 1.5px solid var(--warm-tan);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.35s;
          position: relative;
          overflow: hidden;
        }

        .setup-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .setup-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 32px rgba(139,111,71,0.12);
        }

        .setup-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .setup-code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          padding: 10px 14px;
          border-radius: 10px;
          margin: 10px 0;
          word-break: break-all;
          line-height: 1.6;
        }

        .setup-desc {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          color: var(--warm-muted);
          line-height: 1.6;
        }

        /* Workflow Examples Section */
        .workflows-section {
          margin-top: 56px;
          margin-bottom: 48px;
        }

        .workflow-card {
          background: white;
          border: 2px solid var(--warm-tan);
          border-radius: 18px;
          margin-bottom: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .workflow-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg,
            var(--accent-terracotta),
            var(--accent-gold),
            var(--accent-sage),
            var(--accent-plum)
          );
          opacity: 0;
          transition: opacity 0.4s;
        }

        .workflow-card:hover {
          box-shadow: 0 12px 40px rgba(139,111,71,0.15),
                      0 4px 12px rgba(139,111,71,0.08);
          transform: translateY(-2px);
          border-color: var(--warm-brown);
        }

        .workflow-card:hover::before {
          opacity: 1;
        }

        .workflow-header {
          padding: 24px 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg,
            rgba(250,240,228,0.5),
            rgba(255,255,255,0.8)
          );
          border-bottom: 2px solid var(--warm-tan);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .workflow-header:hover {
          background: linear-gradient(135deg,
            var(--warm-sand),
            var(--warm-cream)
          );
        }

        .workflow-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .workflow-icon {
          font-size: 32px;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .workflow-card:hover .workflow-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .workflow-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--warm-dark);
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .workflow-description {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 14px;
          color: var(--warm-muted);
          margin: 0;
          line-height: 1.5;
        }

        .workflow-difficulty {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          padding: 6px 14px;
          border-radius: 100px;
          background: linear-gradient(135deg, var(--warm-sand), var(--warm-tan));
          color: var(--warm-brown);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.5),
                      0 2px 4px rgba(139,111,71,0.1);
        }

        .workflow-expand-icon {
          font-size: 18px;
          color: var(--warm-brown);
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        }

        .workflow-expand-icon.expanded {
          transform: rotate(180deg);
        }

        .workflow-content {
          padding: 32px 28px;
          background: linear-gradient(135deg,
            rgba(253,246,238,0.3),
            rgba(255,255,255,0.5)
          );
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .workflow-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          border-bottom: 3px solid var(--warm-tan);
          padding-bottom: 0;
          position: relative;
        }

        .workflow-tab {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: var(--warm-muted);
          cursor: pointer;
          border-radius: 10px 10px 0 0;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          bottom: -3px;
          letter-spacing: 0.3px;
        }

        .workflow-tab:hover {
          background: linear-gradient(135deg,
            rgba(245,230,211,0.5),
            rgba(250,240,228,0.5)
          );
          color: var(--warm-dark);
          transform: translateY(-2px);
        }

        .workflow-tab.active {
          color: var(--warm-dark);
          background: white;
          border-bottom: 3px solid var(--accent-terracotta);
          box-shadow: 0 -2px 8px rgba(139,111,71,0.08);
        }

        .workflow-code-block {
          background: linear-gradient(135deg,
            rgba(253,252,251,0.9) 0%,
            rgba(250,248,245,0.95) 100%
          );
          border: 2px solid var(--warm-tan);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
          position: relative;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 4px 16px rgba(139,111,71,0.08),
            0 1px 3px rgba(139,111,71,0.12);
          transition: all 0.3s ease;
        }

        .workflow-code-block:hover {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 6px 24px rgba(139,111,71,0.12),
            0 2px 6px rgba(139,111,71,0.15);
          border-color: var(--warm-brown);
        }

        .workflow-code-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg,
            var(--accent-terracotta) 0%,
            var(--accent-gold) 50%,
            var(--accent-sage) 100%
          );
          border-radius: 16px 16px 0 0;
          opacity: 0.6;
        }

        .workflow-code-header {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          color: var(--warm-brown);
          margin-bottom: 18px;
          font-style: italic;
          font-weight: 600;
          padding-bottom: 14px;
          border-bottom: 2px solid rgba(232,213,192,0.5);
          letter-spacing: 0.01em;
          line-height: 1.6;
        }

        .workflow-copy-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 10px;
          border: 2px solid var(--warm-tan);
          background: linear-gradient(135deg, #ffffff 0%, #fdfcfb 100%);
          color: var(--warm-brown);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 2px 6px rgba(139,111,71,0.1);
          backdrop-filter: blur(4px);
        }

        .workflow-copy-btn:hover {
          background: linear-gradient(135deg, var(--warm-sand) 0%, var(--warm-cream) 100%);
          border-color: var(--warm-brown);
          transform: translateY(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 4px 16px rgba(139,111,71,0.18);
        }

        .workflow-copy-btn:active {
          transform: translateY(0);
          box-shadow:
            inset 0 1px 2px rgba(139,111,71,0.15),
            0 1px 3px rgba(139,111,71,0.1);
        }

        .workflow-copy-btn.copied {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-color: #059669;
          color: #065f46;
          animation: successPulse 0.5s ease-out;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.5),
            0 2px 8px rgba(5,150,105,0.25);
        }

        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .workflow-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding-top: 20px;
          border-top: 2px solid var(--warm-tan);
        }

        .workflow-result,
        .workflow-tip {
          padding: 16px;
          border-radius: 12px;
          background: white;
          border: 1.5px solid rgba(232,213,192,0.5);
          transition: all 0.3s;
        }

        .workflow-result:hover,
        .workflow-tip:hover {
          border-color: var(--warm-tan);
          box-shadow: 0 4px 12px rgba(139,111,71,0.08);
          transform: translateY(-2px);
        }

        .workflow-label {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--warm-brown);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .workflow-label::before {
          content: '';
          width: 20px;
          height: 2px;
          background: linear-gradient(90deg,
            var(--accent-terracotta),
            var(--accent-gold)
          );
          border-radius: 2px;
        }

        .workflow-text {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13.5px;
          color: var(--warm-text);
          line-height: 1.7;
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .workflow-header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .workflow-icon {
            font-size: 28px;
          }

          .workflow-tabs {
            flex-direction: column;
            gap: 8px;
            border-bottom: none;
            padding-bottom: 16px;
          }

          .workflow-tab {
            border-radius: 10px;
            width: 100%;
            bottom: 0;
            text-align: left;
            padding: 14px 20px;
          }

          .workflow-tab.active {
            border-bottom: none;
            border-left: 4px solid var(--accent-terracotta);
            background: linear-gradient(135deg,
              var(--warm-sand),
              var(--warm-cream)
            );
          }

          .workflow-footer {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .workflow-copy-btn {
            position: static;
            width: 100%;
            margin-top: 16px;
          }
        }

        .footer-bar {
          text-align: center;
          padding: 20px 28px 32px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11.5px;
          color: var(--warm-muted);
          line-height: 1.7;
        }

        .footer-divider {
          width: 40px;
          height: 2px;
          background: var(--warm-tan);
          margin: 0 auto 12px;
          border-radius: 2px;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-author {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .footer-linkedin {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,248,245,0.95) 100%);
          border: 1.5px solid var(--warm-tan);
          border-radius: 8px;
          color: #0077b5;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(139,111,71,0.1);
        }

        .footer-linkedin:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,119,181,0.2);
          border-color: #0077b5;
          background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,248,245,1) 100%);
        }

        .footer-sources {
          font-size: 11px;
          color: var(--warm-muted);
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .footer-linkedin {
            font-size: 12px;
            padding: 7px 14px;
          }
        }

        .texture-dots {
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(139,111,71,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
          z-index: 0;
        }

        .floating-accent {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.06;
          pointer-events: none;
          animation: gentleFloat 10s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          /* Container and spacing */
          .warm-container {
            padding: 0 16px;
          }

          /* Header adjustments */
          .editorial-header {
            padding: 32px 16px 24px;
          }

          .masthead-title {
            font-size: 28px;
            line-height: 1.2;
          }

          .masthead-subtitle {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .masthead-meta {
            font-size: 10px;
            letter-spacing: 1.5px;
          }

          /* Stats section */
          .stat-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }

          .stat-box {
            padding: 16px 12px;
          }

          .stat-number {
            font-size: 28px;
          }

          .stat-label {
            font-size: 10px;
            letter-spacing: 1px;
          }

          /* Setup section */
          .setup-grid {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-bottom: 24px;
          }

          .setup-card {
            padding: 18px;
          }

          .setup-title {
            font-size: 15px;
          }

          .setup-code {
            font-size: 11px;
            padding: 8px 12px;
            word-break: break-word;
            overflow-x: auto;
          }

          .setup-desc {
            font-size: 12px;
          }

          /* Section headings */
          .section-heading {
            font-size: 20px;
            margin: 28px 0 6px;
          }

          .section-count {
            font-size: 10px;
            padding: 3px 8px;
          }

          /* Table improvements */
          .table-header, .table-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 11px;
            padding: 10px 8px;
          }

          .comp-row {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 8px;
          }

          /* Category sections */
          .category-divider {
            margin: 24px 0;
          }

          /* Improve touch targets */
          button,
          a,
          .clickable {
            min-height: 44px;
            min-width: 44px;
          }

          /* Workflow section mobile improvements */
          .workflow-card {
            margin-bottom: 14px;
          }

          .workflow-header {
            padding: 16px;
          }

          .workflow-content {
            padding: 16px;
          }

          .workflow-code-block {
            padding: 16px;
            border-radius: 12px;
          }

          .workflow-code-block pre {
            font-size: 12px !important;
            line-height: 1.6 !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .workflow-footer {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          /* Improve text readability */
          body {
            -webkit-text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
          }

          /* Ensure content doesn't overflow */
          * {
            max-width: 100%;
            word-wrap: break-word;
          }

          /* Code blocks scrollable on mobile */
          pre,
          code {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: pre;
          }
        }

        /* Additional breakpoint for very small screens */
        @media (max-width: 480px) {
          .masthead-title {
            font-size: 24px;
          }

          .stat-box {
            padding: 14px 10px;
          }

          .stat-number {
            font-size: 24px;
          }

          .stat-label {
            font-size: 9px;
          }

          .workflow-tabs {
            font-size: 11px;
          }

          .workflow-tab {
            padding: 8px 10px;
          }

          .footer-bar {
            padding: 16px 16px 24px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="texture-dots" />
      <div className="floating-accent" style={{ width: 300, height: 300, left: "-5%", top: "8%", background: "#c2410c" }} />
      <div className="floating-accent" style={{ width: 250, height: 250, right: "-3%", top: "25%", background: "#3f6212", animationDelay: "3s" }} />
      <div className="floating-accent" style={{ width: 200, height: 200, left: "40%", top: "55%", background: "#a16207", animationDelay: "6s" }} />

      {/* HEADER */}
      <header className="editorial-header" style={{
        animation: loaded ? "slideReveal 0.7s ease-out" : "none",
        opacity: loaded ? 1 : 0,
      }}>
        <div className="masthead-line" />
        <div className="masthead-meta">The Definitive Reference · 2026 Edition</div>
        <h1 className="masthead-title">Playwright Commands</h1>
        <p className="masthead-subtitle">MCP Tools — CLI Skills — Test Runner, compared side-by-side</p>
        <div className="divider-ornament">◆</div>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "@playwright/mcp", color: "#4f46e5", bg: "#eef2ff" },
            { label: "@playwright/cli", color: "#059669", bg: "#ecfdf5" },
            { label: "npx playwright", color: "#d97706", bg: "#fffbeb" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: "#6b5b4b", fontWeight: 500 }}>
                {l.label}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div className="hot-dot" />
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11.5, color: "#6b5b4b" }}>
              Most Used
            </span>
          </div>
        </div>
      </header>

      <div className="warm-container" style={{ position: "relative", zIndex: 5 }}>

        {/* STATS */}
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

        {/* TOOLBAR */}
        <div className="toolbar" style={{ animation: loaded ? "slideReveal 0.7s ease-out 0.25s both" : "none" }}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search any command…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="view-pills">
            <button className={`view-pill ${view === "category" ? "active" : ""}`} onClick={() => setView("category")}>
              📂 Category
            </button>
            <button className={`view-pill ${view === "all" ? "active" : ""}`} onClick={() => setView("all")}>
              📋 All
            </button>
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        {view === "category" && !search && (
          <div className="category-nav" style={{ animation: loaded ? "slideReveal 0.7s ease-out 0.3s both" : "none" }}>
            {categories.map((c, i) => (
              <button
                key={i}
                className={`cat-chip ${activeCat === i ? "active" : ""}`}
                onClick={() => setActiveCat(i)}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        )}

        {/* TABLES */}
        <div style={{ animation: loaded ? "slideReveal 0.7s ease-out 0.35s both" : "none" }}>
          {displayCats.map((cat, ci) => (
            <div key={ci}>
              {(view === "all" || search) && (
                <div className="section-heading">
                  <span>{cat.icon}</span> {cat.name}
                  <span className="section-count">{cat.commands.length}</span>
                </div>
              )}

              {/* Pro Tip */}
              {!search && cat.tip && (
                <div className="pro-tip" style={{ animation: `slideFromLeft 0.5s ease-out ${ci * 0.05}s both` }}>
                  <span className="pro-tip-icon">💡</span>
                  <span><strong>Pro Tip:</strong> {cat.tip}</span>
                </div>
              )}

              <div className="table-wrapper">
                <div className="table-header">
                  <div className="table-header-cell" style={{ color: "#6b5b4b" }}>Action</div>
                  <div className="table-header-cell" style={{ color: "#4f46e5" }}>MCP Tool</div>
                  <div className="table-header-cell" style={{ color: "#059669" }}>CLI Skill</div>
                  <div className="table-header-cell" style={{ color: "#d97706" }}>Test Runner</div>
                </div>
                {cat.commands.map((cmd, ri) => (
                  <div className="table-row" key={ri} style={{
                    animation: `rowAppear 0.35s ease-out ${ri * 0.04}s both`,
                  }}>
                    <div className="action-name">
                      {cmd.hot && <div className="hot-dot" />}
                      {cmd.action}
                    </div>
                    <div>{cmd.mcp !== "—" ? <span className="tag-mcp">{cmd.mcp}</span> : <span className="tag-na">—</span>}</div>
                    <div>{cmd.cli !== "—" ? <span className="tag-cli">{cmd.cli}</span> : <span className="tag-na">—</span>}</div>
                    <div>{cmd.test !== "—" ? <span className="tag-test">{cmd.test}</span> : <span className="tag-na">—</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* COMPARISON */}
        <div className="comparison-toggle">
          <button className="comparison-btn" onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? "▲ Hide" : "▼ Show"} MCP vs CLI — Head-to-Head Comparison
          </button>
        </div>

        {showComparison && (
          <div className="comparison-table" style={{ animation: "slideReveal 0.5s ease-out" }}>
            <div className="comp-row" style={{ background: "linear-gradient(135deg, var(--warm-sand), var(--warm-cream))", fontWeight: 700 }}>
              <div style={{ fontFamily: "'Source Sans 3'", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 2, color: "#6b5b4b" }}>Aspect</div>
              <div style={{ fontFamily: "'Source Sans 3'", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 2, color: "#4f46e5" }}>MCP Server</div>
              <div style={{ fontFamily: "'Source Sans 3'", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 2, color: "#059669" }}>CLI Skills</div>
              <div style={{ fontFamily: "'Source Sans 3'", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 2, color: "#6b5b4b" }}>Edge</div>
            </div>
            {comparisonData.map((row, i) => (
              <div className="comp-row" key={i}>
                <div style={{ fontFamily: "'Source Sans 3'", fontSize: 13.5, fontWeight: 700, color: "#3d2b1f" }}>{row.aspect}</div>
                <div style={{ fontFamily: "'Source Sans 3'", fontSize: 12.5, color: "#4a3728", lineHeight: 1.5 }}>{row.mcp}</div>
                <div style={{ fontFamily: "'Source Sans 3'", fontSize: 12.5, color: "#4a3728", lineHeight: 1.5 }}>{row.cli}</div>
                <div>
                  {row.winner === "mcp" && <span className="winner-badge" style={{ background: "#eef2ff", color: "#4f46e5" }}>MCP</span>}
                  {row.winner === "cli" && <span className="winner-badge" style={{ background: "#ecfdf5", color: "#059669" }}>CLI</span>}
                  {row.winner === "tie" && <span className="winner-badge" style={{ background: "#f5f5f4", color: "#78716c" }}>Tie</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETUP CARDS */}
        <div className="section-heading" style={{ marginTop: 10 }}>
          <span>⚙️</span> Quick Setup
        </div>
        <div className="setup-grid">
          <div className="setup-card">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#4f46e5", borderRadius: "16px 16px 0 0" }} />
            <div className="setup-title" style={{ color: "#4f46e5" }}>🤖 MCP Server</div>
            <div className="setup-code" style={{ background: "#eef2ff", color: "#3730a3", border: "1px solid #c7d2fe" }}>
              npx @playwright/mcp@latest
            </div>
            <div className="setup-desc">
              AI agents interact via structured accessibility snapshots. Best for exploratory automation, self-healing tests, and autonomous browser workflows.
            </div>
          </div>
          <div className="setup-card">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#059669", borderRadius: "16px 16px 0 0" }} />
            <div className="setup-title" style={{ color: "#059669" }}>⚡ CLI Skills</div>
            <div className="setup-code" style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" }}>
              npm i -g @playwright/cli@latest
            </div>
            <div className="setup-desc">
              Token-efficient CLI for coding agents. Avoids large tool schemas, uses concise commands. Supports named sessions with persistent state.
            </div>
          </div>
          <div className="setup-card">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#d97706", borderRadius: "16px 16px 0 0" }} />
            <div className="setup-title" style={{ color: "#d97706" }}>🧪 Test Runner</div>
            <div className="setup-code" style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fcd34d" }}>
              npm i -D @playwright/test
            </div>
            <div className="setup-desc">
              The gold standard for CI/CD. Headed/headless execution, HTML reports, trace viewer, codegen, and UI mode for visual debugging.
            </div>
          </div>
        </div>

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
                    <SyntaxHighlighter
                      language={getCodeLanguage(getActiveTab(workflow.id))}
                      style={warmCodeTheme}
                      customStyle={{
                        background: 'linear-gradient(135deg, #fdfcfb 0%, #faf8f5 100%)',
                        padding: '24px 28px',
                        borderRadius: '12px',
                        fontSize: '13.5px',
                        lineHeight: '1.75',
                        margin: 0,
                        border: '1px solid #e8d5c0',
                        boxShadow: 'inset 0 1px 3px rgba(139,111,71,0.08), 0 1px 2px rgba(139,111,71,0.05)',
                        fontWeight: '400',
                        letterSpacing: '0.01em'
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                          textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                          fontVariantLigatures: 'none'
                        }
                      }}
                      showLineNumbers={false}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {workflow[getActiveTab(workflow.id)].code}
                    </SyntaxHighlighter>
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
      </div>

      {/* FOOTER */}
      <footer className="footer-bar">
        <div className="footer-divider" />
        <div className="footer-content">
          <div className="footer-author">
            <strong style={{ fontSize: '16px', color: '#6b4e3d' }}>Rakesh Arrepu</strong>
            <span style={{ fontSize: '14px', color: '#8b6f47' }}>Test Architect · AI Enthusiast</span>
          </div>
          <a
            href="https://www.linkedin.com/in/rakesh-arrepu/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-linkedin"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect on LinkedIn
          </a>
        </div>
        <div className="footer-sources">
          Sources: microsoft/playwright-mcp · microsoft/playwright-cli · playwright.dev
        </div>
        <span style={{ fontSize: 10.5, color: "#b8a898", marginTop: '8px', display: 'block' }}>
          © 2026 · Built with ♥ for the QA Automation Community
        </span>
      </footer>
    </div>
  );
}
