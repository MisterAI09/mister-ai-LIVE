// Next.js Pages API route (pages/api/streams/[...path].js)
// Proxy for HLS streams at http://135.125.109.73:9000
export default async function handler(req, res) {
  // Basic CORS + OPTIONS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range,Accept,Origin,If-Modified-Since,Cache-Control,Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { path } = req.query;
    const joined = Array.isArray(path) ? path.join('/') : String(path || '');
    const upstreamUrl = `http://135.125.109.73:9000/${joined}`;

    // Forward important headers (Range is critical for HLS segments)
    const forwardHeaders = {};
    if (req.headers.range) forwardHeaders['range'] = req.headers.range;
    if (req.headers['user-agent']) forwardHeaders['user-agent'] = req.headers['user-agent'];
    if (req.headers.origin) forwardHeaders['origin'] = req.headers.origin;

    const upstreamRes = await fetch(upstreamUrl, {
      method: 'GET',
      headers: forwardHeaders
    });

    // Copy relevant headers back to client
    const copyHeaders = ['content-type', 'content-length', 'accept-ranges', 'content-range', 'cache-control'];
    copyHeaders.forEach((h) => {
      const v = upstreamRes.headers.get(h);
      if (v) res.setHeader(h, v);
    });

    res.status(upstreamRes.status);

    // Stream response body chunk-by-chunk (compatible with Vercel Node runtime)
    const reader = upstreamRes.body?.getReader?.();
    if (!reader) {
      // fallback (should rarely happen)
      const buf = Buffer.from(await upstreamRes.arrayBuffer());
      res.end(buf);
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (err) {
    console.error('Stream proxy error:', err);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(502).end('Bad Gateway: failed to proxy stream');
  }
}
