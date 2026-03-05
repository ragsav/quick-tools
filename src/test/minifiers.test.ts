import { describe, it, expect, vi } from 'vitest';
import { POST as MinifyCssRoute } from '../pages/api/minify-css';
import { POST as MinifyHtmlRoute } from '../pages/api/minify-html';

function createMockRequest(body: any) {
  return {
    json: async () => body
  } as Request;
}

describe('Minifier API Routes', () => {
  describe('CSS Minifier API', () => {
    it('should minify simple CSS', async () => {
      const input = `
        .container {
          display: flex;
          margin: 0 auto;
        }
      `;

      const req = createMockRequest({ input });
      const response = await MinifyCssRoute({ request: req } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.minified).toBe(`.container{display:flex;margin:0 auto}`);
    });

    it('should handle edge cases with content property strings', async () => {
      const input = `
        .icon::before {
          content: "   this string   has   spaces   ";
        }
      `;

      const req = createMockRequest({ input });
      const response = await MinifyCssRoute({ request: req } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.minified).toBe(`.icon::before{content:"   this string   has   spaces   "}`);
    });

    it('should return 400 for empty input', async () => {
      const req = createMockRequest({ input: "" });
      const response = await MinifyCssRoute({ request: req } as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("No input provided");
    });
  });

  describe('HTML Minifier API', () => {
    it('should minify simple HTML', async () => {
      const input = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test</title>
          </head>
          <body>
            <h1>Hello World</h1>
          </body>
        </html>
      `;

      const req = createMockRequest({ input });
      const response = await MinifyHtmlRoute({ request: req } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.minified).toBe(`<!doctype html><html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>`);
    });

    it('should properly handle <pre> and <textarea> content by preserving whitespace', async () => {
      const input = `
        <div>
          <pre>
    function test() {
      console.log("hello");
    }
          </pre>
          <textarea>   Some   text   with   spaces   </textarea>
        </div>
      `;

      const req = createMockRequest({ input });
      const response = await MinifyHtmlRoute({ request: req } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.minified).toContain('    function test() {\n      console.log("hello");\n    }\n');
      expect(data.minified).toContain('   Some   text   with   spaces   ');
    });

    it('should return 400 for empty input', async () => {
      const req = createMockRequest({ input: "" });
      const response = await MinifyHtmlRoute({ request: req } as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("No input provided");
    });
  });
});
