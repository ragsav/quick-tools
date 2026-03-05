export const prerender = false;
import type { APIRoute } from 'astro';
import CleanCSS from 'clean-css';

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

    const minifiedOutput = new CleanCSS({}).minify(input);

    if (minifiedOutput.errors.length > 0) {
      return new Response(JSON.stringify({ error: minifiedOutput.errors[0] }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(JSON.stringify({ minified: minifiedOutput.styles }), {
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
