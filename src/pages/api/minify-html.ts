export const prerender = false;
import type { APIRoute } from 'astro';
import { minify as minifyHtml } from 'html-minifier-terser';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const input = data.input;

    if (!input) {
      return new Response(JSON.stringify({ error: "No input provided" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    const minified = await minifyHtml(input, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    });

    return new Response(JSON.stringify({ minified }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
