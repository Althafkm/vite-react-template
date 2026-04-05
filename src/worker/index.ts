import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// List of common search engine bots
const bots = [
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot'
];

// Middleware to detect bots and serve pre-rendered pages
app.use('*', async (c, next) => {
  const userAgent = c.req.header('User-Agent') || '';
  const isBot = bots.some(bot => userAgent.includes(bot));

  if (isBot) {
    // Construct URL to fetch pre-rendered HTML
    const url = new URL(c.req.url);
    const prerenderedUrl = `https://auzzis.com${url.pathname}`;
    
    // Fetch the pre-rendered page
    const response = await fetch(prerenderedUrl);
    
    // Return the response to the bot
    return response;
  }

  // Normal users continue to the React app
  await next();
});

// Example API route
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
