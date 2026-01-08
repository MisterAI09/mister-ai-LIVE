// /pages/api/proxy.js
import http from 'http';
import https from 'https';
import { URL } from 'url';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // التحقق من صحة URL
    const targetUrl = new URL(url);
    
    // تحديد module بناءً على البروتوكول
    const client = targetUrl.protocol === 'https:' ? https : http;
    
    // إعداد headers
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Origin': targetUrl.origin,
      'Referer': targetUrl.origin + '/',
    };

    // إعداد options للطلب
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port,
      path: targetUrl.pathname + targetUrl.search,
      method: 'GET',
      headers: headers,
      timeout: 30000 // 30 ثانية timeout
    };

    // إجراء الطلب
    const proxyReq = client.request(options, (proxyRes) => {
      // نسخ headers من الاستجابة
      res.writeHead(proxyRes.statusCode, {
        'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

      // نقل البيانات
      proxyRes.pipe(res);
    });

    // معالجة الأخطاء
    proxyReq.on('error', (error) => {
      console.error('Proxy request error:', error);
      res.status(500).json({ error: 'Proxy error', details: error.message });
    });

    // timeout handling
    proxyReq.setTimeout(30000, () => {
      proxyReq.destroy();
      res.status(504).json({ error: 'Proxy timeout' });
    });

    proxyReq.end();

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
