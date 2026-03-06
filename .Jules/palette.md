## 2024-03-06 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Found multiple icon-only copy buttons (using just the '📋' emoji) across different tool pages like slug-generator, password-generator, color-picker, etc. that lack aria-labels, making them inaccessible to screen readers.
**Action:** When creating icon-only buttons, always ensure an `aria-label` or `title` attribute is added to provide context to assistive technologies.
