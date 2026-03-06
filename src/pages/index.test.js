import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const astroFilePath = path.join(process.cwd(), 'src/pages/index.astro');
const astroFileContent = fs.readFileSync(astroFilePath, 'utf-8');

const toggleThemeMatch = astroFileContent.match(/function toggleTheme\(\) \{[\s\S]*?\}/);

describe('toggleTheme', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    localStorage.clear();

    if (toggleThemeMatch) {
      eval(`window.toggleTheme = ${toggleThemeMatch[0]}`);
    } else {
      throw new Error("Could not find toggleTheme function in index.astro");
    }
  });

  afterEach(() => {
    delete window.toggleTheme;
  });

  it('should add dark class and set localStorage to dark if it was light', () => {
    document.documentElement.classList.remove('dark');

    window.toggleTheme();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should remove dark class and set localStorage to light if it was dark', () => {
    document.documentElement.classList.add('dark');

    window.toggleTheme();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
