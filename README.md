# mister-ai-LIVE

مشروع Next.js بسيط لعرض قنوات m3u8 عبر Vercel proxy.

مكونات:
- صفحة رئيسية تعرض مشغل فيديو وقائمة قنوات.
- دالة API (`/api/streams/[...path]`) تعمل كـ proxy لتمرير طلبات HLS من الخادم HTTP المصدر `http://135.125.109.73:9000` إلى موقعك عبر HTTPS (Vercel) لتجنّب Mixed Content وCORS.

تحذير:
- تأكد أنك مخوّل لإعادة بث المحتوى.
- دوال Vercel لها حدود زمنية وباندويث — للحِمل العالي استخدم VPS أو Nginx.

تشغيل محلي:
1. انسخ المشروع.
2. npm install
3. npm run dev
4. افتح http://localhost:3000

نشر على Vercel:
- ادفع المستودع إلى GitHub ثم اربطه في Vercel. بعد النشر ستعمل القنوات عبر:
  `https://<your-site>.vercel.app/api/streams/beinsport1_.m3u8`
