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

// Middleware to detect bots
app.use('*', async (c, next) => {
  const userAgent = c.req.header('User-Agent') || ''; // <-- fixed
  const isBot = bots.some(bot => userAgent.includes(bot));

  if (isBot) {
    // Serve pre-rendered HTML for bots
    const url = new URL(c.req.url);
    const prerenderedUrl = `https://auzzis.com${url.pathname}`;
    const response = await fetch(prerenderedUrl);
    return response;
  }

  // Normal users go to React app
  await next();
});

// API route
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
