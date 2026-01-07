import Head from 'next/head';
import { useEffect, useRef } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    // تحميل hls.js عبر CDN عند أول استخدام (client-side)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      if (hlsRef.current && hlsRef.current.destroy) {
        try { hlsRef.current.destroy(); } catch(e) {}
      }
    };
  }, []);

  // قائمة القنوات تشير إلى proxy API
  const channels = [
    { title: '🟪 1', url: '/api/streams/beinsport1_.m3u8' },
    { title: '🟪 2', url: '/api/streams/beinsport2_.m3u8' },
    { title: '🟪 3', url: '/api/streams/beinsport3_.m3u8' },
    { title: '🟪 4', url: '/api/streams/beinsport4_.m3u8' },
    { title: '🟪 5', url: '/api/streams/beinsport5_.m3u8' },
    { title: '🟪 6', url: '/api/streams/beinsport6_.m3u8' },
    { title: '🟪 7', url: '/api/streams/beinsport7_.m3u8' },
    { title: '🟪 8', url: '/api/streams/beinsport8_.m3u8' },
    { title: '🟪 9', url: '/api/streams/beinsport9_.m3u8' }
  ];

  function playUrl(url) {
    const video = videoRef.current;
    if (!video) return;
    // If native HLS supported (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.load();
      video.play().catch(()=>{});
      return;
    }
    // Use Hls.js if available
    const Hls = window.Hls;
    if (!Hls) {
      console.warn('hls.js not loaded yet');
      return;
    }
    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch(e) {}
      hlsRef.current = null;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(()=>{});
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error', data);
      });
    } else {
      console.warn('HLS not supported in this browser');
    }
  }

  return (
    <>
      <Head>
        <title>MisterAI LIVE | قنوات المباشر</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
      </Head>

      <main className="min-h-screen bg-[#020617] text-[#e2e8f0] p-6">
        <header className="max-w-6xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent" style={{background: 'linear-gradient(90deg,#00f2ff,#00ff88,#00f2ff)'}}>
            MISTERAI LIVE
          </h1>
          <p className="text-sm text-cyan-400 mt-2">تجريب البث المباشر عبر Vercel proxy</p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-gray-900/60 border border-cyan-900/20">
              <h3 className="text-cyan-300 font-bold mb-4 flex items-center gap-2"><i className="fas fa-tv"></i> قنوات BeIN Sport</h3>

              <div className="mb-4">
                <video id="tvPlayer" ref={videoRef} controls playsInline className="w-full rounded-lg bg-black h-56 object-cover"></video>
                <div className="text-xs text-gray-400 mt-2">اضغط على قناة لتشغيلها. إن لم يعمل الصوت فعّل الصوت من مشغل الفيديو.</div>
              </div>

              <div className="grid grid-cols-3 gap-2" id="channelList">
                {channels.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => playUrl(ch.url)}
                    className="py-2 px-2 rounded-lg bg-white/3 border border-white/5 text-sm font-bold hover:translate-y-[-2px] transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-violet-700 text-white rounded px-2 py-0.5 text-xs">{idx+1}</span>
                      <span className="mr-2">{ch.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-8">
            <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/5">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">تخريفات المستر</h2>
                <button onClick={() => { /* demo */ alert('استحضار مقال تجريبي'); }} className="bg-cyan-600 px-4 py-2 rounded-lg font-bold">استحضار مقال</button>
              </div>

              <div className="mt-6 min-h-[180px] rounded-lg border-dashed border border-white/5 p-6 text-gray-400">
                اضغط على أي قناة في اللوحة الجانبية لتشغيلها.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/5">
              <h3 className="text-sm uppercase text-gray-400 tracking-wider">GLOBAL_INTEL | الموجز العالمي</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="news-container"></div>
            </div>
          </section>
        </div>

        <footer className="max-w-6xl mx-auto text-center text-xs text-gray-500 mt-12">
          PROGRAMMING_DNA | MISTERAI_SECURITY | 2026
        </footer>
      </main>

      {/* fontawesome (optional) */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
    </>
  );
}
