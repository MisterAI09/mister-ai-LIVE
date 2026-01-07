import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const channels = [
    { id: '1', title: '🟪 beIN 1', url: '/api/streams/beinsport1_.m3u8' },
    { id: '2', title: '🟪 beIN 2', url: '/api/streams/beinsport2_.m3u8' },
    { id: '3', title: '🟪 beIN 3', url: '/api/streams/beinsport3_.m3u8' },
    { id: '4', title: '🟪 beIN 4', url: '/api/streams/beinsport4_.m3u8' },
    { id: '5', title: '🟪 beIN 5', url: '/api/streams/beinsport5_.m3u8' },
    { id: '6', title: '🟪 beIN 6', url: '/api/streams/beinsport6_.m3u8' },
    { id: '7', title: '🟪 beIN 7', url: '/api/streams/beinsport7_.m3u8' },
    { id: '8', title: '🟪 beIN 8', url: '/api/streams/beinsport8_.m3u8' },
    { id: '9', title: '🟪 beIN 9', url: '/api/streams/beinsport9_.m3u8' }
  ];

  const [activeId, setActiveId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Load HLS.js Library
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js';
    s.async = true;
    document.body.appendChild(s);
    return () => {
      if (document.body.contains(s)) document.body.removeChild(s);
    };
  }, []);

  // 2. Animated Starfield Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = [];
    const STAR_COUNT = Math.round((w * h) / 7000);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: rand(0.2, 1.0),
        vy: rand(0.15, 0.8),
        size: rand(0.6, 2.6),
        tw: Math.random() * Math.PI * 2
      });
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    function render(t) {
      ctx.clearRect(0, 0, w, h);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.tw += 0.02 * s.z;
        const twinkle = 0.6 + Math.sin(s.tw) * 0.4;
        s.y += s.vy * (1 + s.z * 1.5);
        if (s.y > h + 20) { s.y = -10; s.x = Math.random() * w; }

        ctx.beginPath();
        ctx.fillStyle = `rgba(14, 165, 233, ${(0.4 + s.z * 0.6) * twinkle})`;
        ctx.arc(s.x, s.y, s.size * (1 + s.z), 0, Math.PI * 2);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(render);
    }
    animRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // 3. Play Logic
  function playUrl(channel) {
    setErrorMsg('');
    const video = videoRef.current;
    if (!video) return;
    setActiveId(channel.id);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      video.src = channel.url;
      video.muted = isMuted;
      video.play().catch(() => {});
      return;
    }

    const Hls = window.Hls;
    if (!Hls) {
      setErrorMsg('جارٍ تحميل المشغل... حاول مجدداً');
      return;
    }

    if (hlsRef.current) hlsRef.current.destroy();

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = isMuted;
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.type === 'networkError') setErrorMsg('خطأ في الاتصال بمصدر البث');
      });
    }
  }

  return (
    <div dir="rtl" className="text-white selection:bg-cyan-500/30">
      <Head>
        <title>MISTERAI LIVE — Premium Streaming</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          .glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.08); }
          .channel-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .channel-card:hover { background: rgba(255,255,255,0.05); transform: scale(1.02); }
          .active-channel { border-color: #06b6d4; background: rgba(6, 182, 212, 0.1) !important; box-shadow: 0 0 20px rgba(6,182,212,0.1); }
          .btn-cyan { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); transition: opacity 0.2s; }
          .btn-cyan:hover { opacity: 0.9; }
          video::-webkit-media-controls-panel { background-image: linear-gradient(transparent, rgba(0,0,0,0.8)) !important; }
        `}</style>
      </Head>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      <main className="relative z-10 min-h-screen p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-right">
              <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-l from-cyan-400 via-blue-400 to-cyan-400">
                MISTERAI LIVE
              </h1>
              <p className="text-gray-400 mt-2 font-medium">تجربة بث فريدة بواسطة Mustafa</p>
            </div>
            <div className="flex items-center gap-3 glass px-6 py-3 rounded-2xl border-cyan-500/20">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-sm font-bold tracking-widest text-gray-200">LIVE FEED</span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Player */}
            <div className="lg:col-span-8">
              <div className="glass rounded-[2.5rem] overflow-hidden p-3 shadow-2xl">
                <video ref={videoRef} controls playsInline className="w-full aspect-video rounded-[2rem] bg-black shadow-inner" />
              </div>
              
              <div className="mt-6 glass p-6 rounded-[2rem] flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-3">
                  <button onClick={() => { videoRef.current.muted = !videoRef.current.muted; setIsMuted(!isMuted); }} className="px-6 py-3 rounded-2xl glass hover:bg-white/10 font-bold text-sm">
                    {isMuted ? '🔊 تشغيل الصوت' : '🔇 كتم'}
                  </button>
                  <button onClick={() => videoRef.current.currentTime -= 10} className="w-12 h-12 rounded-2xl glass hover:bg-white/10 flex items-center justify-center"> ↺ </button>
                  <button onClick={() => videoRef.current.currentTime += 10} className="w-12 h-12 rounded-2xl glass hover:bg-white/10 flex items-center justify-center"> ↻ </button>
                </div>
                <button onClick={() => { const ch = channels.find(c => c.id === activeId); if(ch) playUrl(ch); }} className="btn-cyan px-10 py-3 rounded-2xl font-black text-black text-sm uppercase">إعادة تحديث</button>
              </div>
              {errorMsg && <p className="mt-4 text-center text-red-400 font-bold">{errorMsg}</p>}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass rounded-[2.5rem] p-8">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-cyan-400 rounded-full"></span>
                  قنوات المبدع
                </h2>
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scroll">
                  {channels.map((ch) => (
                    <div 
                      key={ch.id} 
                      onClick={() => playUrl(ch)}
                      className={`channel-card p-4 rounded-2xl flex items-center justify-between cursor-pointer border border-white/5 ${activeId === ch.id ? 'active-channel' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${activeId === ch.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-400'}`}>
                          {ch.id}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-100">{ch.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Direct Stream</p>
                        </div>
                      </div>
                      {activeId === ch.id && <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4]"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="mt-20 pb-12">
            <div className="glass max-w-5xl mx-auto p-10 rounded-[3rem] text-center relative border-white/10">
              <div className="flex flex-wrap justify-center items-center gap-8 mb-10">
                <a 
                  href="https://x.com/neurosisnet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all group"
                >
                  <svg className="w-5 h-5 fill-current text-gray-400 group-hover:text-cyan-400" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="font-bold text-gray-300 group-hover:text-cyan-400 text-sm">@neurosisnet</span>
                </a>
              </div>
              
              <div className="max-w-3xl mx-auto mb-10">
                <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.3em] mb-4">Legal Disclaimer</p>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                  نحن في <span className="text-gray-300 font-bold italic underline decoration-cyan-500/50">MISTERAI LIVE</span> نوفر واجهة عرض منظمة للروابط المتوفرة للعامة. لا نقوم بتخزين أو استضافة أي محتوى مرئي. جميع الحقوق تعود لملاكها الأصليين (beIN Media Group).
                </p>
              </div>

              <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-400">برمجة وتطوير</p>
                  <p className="text-lg font-black text-white tracking-tight">Mustafa — MisterAI</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-1">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">© 2026 MISTERAI LIVE — Version 2.0</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-[9px] text-cyan-500/70 font-mono tracking-tighter uppercase leading-none">Security Cloud: Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
