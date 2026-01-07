import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const channels = [
    { id: '1', title: 'beIN Sport 1', url: '/api/streams/beinsport1_.m3u8' },
    { id: '2', title: 'beIN Sport 2', url: '/api/streams/beinsport2_.m3u8' },
    { id: '3', title: 'beIN Sport 3', url: '/api/streams/beinsport3_.m3u8' },
    { id: '4', title: 'beIN Sport 4', url: '/api/streams/beinsport4_.m3u8' },
    { id: '5', title: 'beIN Sport 5', url: '/api/streams/beinsport5_.m3u8' },
    { id: '6', title: 'beIN Sport 6', url: '/api/streams/beinsport6_.m3u8' },
    { id: '7', title: 'beIN Sport 7', url: '/api/streams/beinsport7_.m3u8' },
    { id: '8', title: 'beIN Sport 8', url: '/api/streams/beinsport8_.m3u8' },
    { id: '9', title: 'beIN Sport 9', url: '/api/streams/beinsport9_.m3u8' }
  ];

  // تحميل مكتبة HLS بشكل مستقر
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, []);

  function playUrl(channel) {
    setErrorMsg('');
    const video = videoRef.current;
    if (!video) return;
    setActiveId(channel.id);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.muted = isMuted;
      video.play().catch(() => {});
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        video.muted = isMuted;
        video.play().catch(() => {});
      });
    } else {
      setErrorMsg('المتصفح لا يدعم التشغيل');
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#050810] text-slate-200 font-sans">
      <Head>
        <title>MISTERAI LIVE — البث المباشر</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
          .active-glow { box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); border-color: rgba(6, 182, 212, 0.5) !important; }
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.5); border-radius: 10px; }
        `}</style>
      </Head>

      <main className="max-w-7xl mx-auto p-4 md:p-10 relative">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">
              MisterAI <span className="text-cyan-500 italic">Live</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">بث مباشر فائق الجودة</p>
          </div>
          <div className="flex gap-4">
            <a href="https://x.com/neurosisnet" target="_blank" rel="noreferrer" className="glass-panel px-6 py-2 rounded-full text-sm hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">Twitter</span> @neurosisnet
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content: Player */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl p-2 bg-black">
              <video 
                ref={videoRef} 
                controls 
                playsInline 
                className="w-full aspect-video rounded-2xl bg-black shadow-inner"
              />
            </div>

            {/* Controls Row */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => { videoRef.current.muted = !videoRef.current.muted; setIsMuted(!isMuted); }}
                  className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold text-sm transition-all"
                >
                  {isMuted ? '🔇 تشغيل الصوت' : '🔊 كتم'}
                </button>
              </div>
              
              <button 
                onClick={() => { if(activeId) playUrl(channels.find(c => c.id === activeId)); }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-xl font-black text-sm transition-all"
              >
                تحديث البث
              </button>
            </div>
            {errorMsg && <p className="text-red-400 text-sm font-bold text-center">{errorMsg}</p>}
          </div>

          {/* Sidebar: Channels List */}
          <div className="lg:col-span-4 h-full">
            <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-white">
                <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
                قنوات BeIN Sport
              </h3>
              <div className="space-y-3 custom-scroll overflow-y-auto max-h-[500px] pl-2">
                {channels.map((ch) => (
                  <button 
                    key={ch.id} 
                    onClick={() => playUrl(ch)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeId === ch.id ? 'active-glow bg-cyan-500/10 text-cyan-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-400 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black ${activeId === ch.id ? 'bg-cyan-500 text-black' : 'bg-black/40 text-slate-500'}`}>
                        {ch.id}
                      </span>
                      <span className="font-bold text-sm tracking-wide">{ch.title}</span>
                    </div>
                    {activeId === ch.id && <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <footer className="mt-20 border-t border-white/5 pt-10 text-center">
          <p className="text-sm text-slate-400 font-bold mb-4 italic">
             تم التطوير بواسطة Mustafa — MisterAI
          </p>
          <div className="max-w-3xl mx-auto glass-panel p-6 rounded-3xl border-white/5">
            <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed uppercase tracking-widest">
              إخلاء مسؤولية: موقع MISTERAI LIVE لا يستضيف أي محتوى على خوادمه. الموقع هو مجرد أداة لتنظيم روابط البث العامة المتوفرة على الإنترنت. جميع الحقوق تعود لأصحابها الأصليين.
            </p>
          </div>
          <p className="mt-8 text-[10px] text-slate-700 font-black uppercase tracking-tighter">
            © 2026 MISTERAI LIVE — ALL RIGHTS RESERVED
          </p>
        </footer>
      </main>
    </div>
  );
}
