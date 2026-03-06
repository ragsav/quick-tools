import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const astroContent = fs.readFileSync(path.resolve(__dirname, '../index.astro'), 'utf-8');
// Extract just the script containing toggleCategoryDropdown
const match = astroContent.match(/function toggleCategoryDropdown\(\) \{[\s\S]*?\n\t{3}\}/);
const functionContent = match ? match[0] : '';

describe('toggleCategoryDropdown', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="category-dropdown">
        <div id="category-menu" class="hidden"></div>
        <div id="dropdown-arrow" style=""></div>
      </div>
    `;

    // Evaluate the function directly into the window object
    // Since jsdom doesn't expose var/function definitions from script tags directly to the window in the test context
    // We can evaluate it and explicitly assign it
    eval(`
      ${functionContent}
      window.toggleCategoryDropdown = toggleCategoryDropdown;
    `);
  });

  it('should remove hidden class and rotate arrow when closed', () => {
    const menu = document.getElementById('category-menu');
    const arrow = document.getElementById('dropdown-arrow');

    expect(menu?.classList.contains('hidden')).toBe(true);

    // @ts-ignore
    window.toggleCategoryDropdown();

    expect(menu?.classList.contains('hidden')).toBe(false);
    expect(arrow?.style.transform).toBe('rotate(180deg)');
  });

  it('should add hidden class and reset arrow when open', () => {
    const menu = document.getElementById('category-menu');
    const arrow = document.getElementById('dropdown-arrow');

    // Open it first
    menu?.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';

    // @ts-ignore
    window.toggleCategoryDropdown();

    expect(menu?.classList.contains('hidden')).toBe(true);
    expect(arrow?.style.transform).toBe('');
  });
});

describe('Close dropdown when clicking outside', () => {
  let clickHandler: any;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="category-dropdown">
        <button id="dropdown-button">Categories</button>
        <div id="category-menu" class="hidden"></div>
        <div id="dropdown-arrow" style=""></div>
      </div>
      <div id="outside-element">Outside</div>
    `;

    // Extract the event listener part
    const eventListenerMatch = astroContent.match(/document\.addEventListener\('click', \((e)\) => \{([\s\S]*?)\}\);/);
    if (eventListenerMatch) {
      // Instead of evaling the whole addEventListener, extract the handler
      // so we can clean it up later
      const params = eventListenerMatch[1];
      const body = eventListenerMatch[2];
      clickHandler = new Function(params, body);
      document.addEventListener('click', clickHandler);
    }
  });

  afterEach(() => {
    if (clickHandler) {
      document.removeEventListener('click', clickHandler);
    }
  });

  it('should close dropdown when clicking outside', () => {
    const menu = document.getElementById('category-menu');
    const arrow = document.getElementById('dropdown-arrow');
    const outsideElement = document.getElementById('outside-element');

    // Open it first
    menu?.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';

    // Click outside
    outsideElement?.click();

    expect(menu?.classList.contains('hidden')).toBe(true);
    expect(arrow?.style.transform).toBe('');
  });

  it('should not close dropdown when clicking inside', () => {
    const menu = document.getElementById('category-menu');
    const arrow = document.getElementById('dropdown-arrow');
    const dropdownButton = document.getElementById('dropdown-button');

    // Open it first
    menu?.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';

    // Click inside
    dropdownButton?.click();

    expect(menu?.classList.contains('hidden')).toBe(false);
    expect(arrow?.style.transform).toBe('rotate(180deg)');
  });
});

describe('toggleTheme', () => {
  beforeEach(() => {
    // Reset local storage
    localStorage.clear();

    // Reset classes
    document.documentElement.className = '';

    // Extract and evaluate the theme toggle function
    const themeMatch = astroContent.match(/function toggleTheme\(\) \{[\s\S]*?\n\t{3}\}/);
    if (themeMatch) {
      eval(`
        ${themeMatch[0]}
        window.toggleTheme = toggleTheme;
      `);
    }
  });

  it('should toggle to dark theme when currently light', () => {
    // Current is light
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle
    // @ts-ignore
    window.toggleTheme();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle to light theme when currently dark', () => {
    // Current is dark
    document.documentElement.classList.add('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle
    // @ts-ignore
    window.toggleTheme();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
