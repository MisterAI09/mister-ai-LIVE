import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [loadingHls, setLoadingHls] = useState(true);
  const [error, setError] = useState("");

  // قائمة القنوات (تشير إلى proxy API الموجود في المشروع)
  const channels = [
    { id: "1", title: "BeIN Sport 1", url: "/api/streams/beinsport1_.m3u8" },
    { id: "2", title: "BeIN Sport 2", url: "/api/streams/beinsport2_.m3u8" },
    { id: "3", title: "BeIN Sport 3", url: "/api/streams/beinsport3_.m3u8" },
    { id: "4", title: "BeIN Sport 4", url: "/api/streams/beinsport4_.m3u8" },
    { id: "5", title: "BeIN Sport 5", url: "/api/streams/beinsport5_.m3u8" },
    { id: "6", title: "BeIN Sport 6", url: "/api/streams/beinsport6_.m3u8" },
    { id: "7", title: "BeIN Sport 7", url: "/api/streams/beinsport7_.m3u8" },
    { id: "8", title: "BeIN Sport 8", url: "/api/streams/beinsport8_.m3u8" },
    { id: "9", title: "BeIN Sport 9", url: "/api/streams/beinsport9_.m3u8" }
  ];

  // تحميل hls.js ديناميكياً على الطرف العميل
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    s.onload = () => setLoadingHls(false);
    s.onerror = () => {
      setLoadingHls(false);
      setError("فشل تحميل مشغل HLS.");
    };
    document.body.appendChild(s);
    return () => {
      try {
        document.body.removeChild(s);
      } catch {}
    };
  }, []);

  // وظيفة تشغيل الرابط باستخدام hls.js أو native
  function playChannel(ch) {
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    // native HLS (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      try {
        if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      } catch {}
      video.src = ch.url;
      video.load();
      video.muted = muted;
      video.play().catch(() => {});
      return;
    }

    // استخدام hls.js
    const Hls = window.Hls;
    if (!Hls) {
      setError("جاري تحميل مشغل الفيديو — حاول مجدداً بعد ثوانٍ.");
      return;
    }

    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch {}
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(ch.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = muted;
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error", data);
        if (data && data.type === "networkError") setError("تعذر تحميل البث — مشكلة في الشبكة أو المصدر.");
      });
    } else {
      setError("متصفحك لا يدعم HLS.");
    }
  }

  // تنظيف عند الخروج
  useEffect(() => {
    return () => {
      try { if (hlsRef.current) hlsRef.current.destroy(); } catch {}
    };
  }, []);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function requestFull() {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  // تخطيط متجاوب: على الهواتف تظهر أزرار القنوات أفقيًا (scroll) أسفل الشاشة
  return (
    <>
      <Head>
        <title>mister-ai-live — بث مباشر</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          :root{
            --bg1: #020617;
            --panel: rgba(8,12,20,0.6);
            --neon1: #00f2c3;
            --neon2: #00c6ff;
          }
          body { font-family: 'Cairo', sans-serif; background: radial-gradient(circle at 10% 10%, rgba(0,30,45,0.12), transparent 10%), var(--bg1); color: #e6eef6; }
          /* animated gradient logo */
          .logo-gradient {
            background: linear-gradient(90deg, #00f2c3, #00c6ff, #7effc6, #4ae8ff);
            background-size: 300% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: logoShift 6s linear infinite;
            font-weight: 900;
            letter-spacing: 0.02em;
          }
          @keyframes logoShift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }

          /* glowing frame around player */
          .player-frame {
            border-radius: 18px;
            padding: 6px;
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            box-shadow: 0 24px 60px rgba(0,110,160,0.08), inset 0 0 30px rgba(0,180,255,0.02);
            border: 1px solid rgba(0,200,255,0.08);
          }

          /* channel button styles */
          .channel-btn { transition: transform .12s, box-shadow .12s; }
          .channel-btn:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(0,160,255,0.06); }
          .channel-active { box-shadow: 0 18px 40px rgba(0,200,255,0.12); transform: translateY(-6px); border-color: rgba(0,200,255,0.18); }

          /* small scrollbar for lists */
          .thin-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
          .thin-scroll::-webkit-scrollbar-thumb { background: rgba(0,198,255,0.12); border-radius: 10px; }

          /* responsive: small screens - show channel list as horizontal scroller */
          @media (max-width: 768px) {
            .desktop-channels { display: none; }
            .mobile-channels { display: flex; overflow-x: auto; gap: 0.6rem; padding-bottom: 6px; }
            .mobile-channels::-webkit-scrollbar{ height:8px }
          }
          @media (min-width: 769px) {
            .mobile-channels { display: none; }
          }
        `}</style>
      </Head>

      <main dir="rtl" className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
        {/* Header: animated logo */}
        <header className="w-full max-w-[1200px] flex items-center justify-between mb-6">
          <div>
            <div className="logo-gradient text-3xl md:text-5xl">mister-ai-live</div>
            <div className="text-xs text-gray-400 mt-1">قنوات مباشرة · تصميم متجاوب</div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => { if (active) playChannel(channels.find(c=>c.id===active)); }} className="px-3 py-2 bg-cyan-500 rounded-xl text-xs font-bold">إعادة تحميل</button>
            <button onClick={toggleMute} className="px-3 py-2 bg-white/6 rounded-xl text-xs">{muted ? 'إلغاء كتم' : 'كتم'}</button>
            <button onClick={requestFull} className="px-3 py-2 bg-white/6 rounded-xl text-xs">ملء الشاشة</button>
          </div>
        </header>

        {/* Main layout */}
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Channels column (left on desktop) */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-[rgba(6,10,16,0.55)] rounded-2xl p-4 thin-scroll h-full shadow-lg">
              <h4 className="text-cyan-300 font-black mb-3">قائمة القنوات</h4>
              <div className="hidden desktop-channels flex-col gap-3">
                {channels.map((ch) => (
                  <div key={ch.id} className={`channel-btn flex items-center justify-between p-3 rounded-xl border ${active===ch.id ? 'channel-active border-cyan-400/30 bg-cyan-900/6' : 'border-white/6' } mb-2`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-8 rounded-md flex items-center justify-center font-extrabold ${active===ch.id ? 'bg-cyan-400 text-black' : 'bg-violet-600 text-white'}`}>{ch.id}</div>
                      <div className="text-sm font-bold">{ch.title}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => playChannel(ch)} className="px-3 py-1 bg-cyan-500 rounded-lg text-xs font-bold">▶ تشغيل</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* mobile channels (horizontal scroller) */}
              <div className="mobile-channels mt-2">
                {channels.map((ch) => (
                  <button key={ch.id} onClick={() => playChannel(ch)} className={`min-w-[110px] channel-btn p-3 rounded-xl bg-white/4 border border-white/5 flex-shrink-0 ${active===ch.id ? 'channel-active' : ''}`}>
                    <div className="text-xs font-black text-white/90 text-center">{ch.title}</div>
                    <div className="text-[10px] text-gray-300 mt-1">قناة {ch.id}</div>
                  </button>
                ))}
              </div>

            </div>
          </aside>

          {/* Player area (center) */}
          <section className="lg:col-span-3 order-1 lg:order-2">
            <div className="player-frame rounded-2xl">
              <div className="bg-[#000] rounded-xl overflow-hidden">
                <video ref={videoRef} id="tvPlayer" controls playsInline className="w-full h-[56vh] md:h-[54vh] lg:h-[58vh] object-cover bg-black" />
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm">{active ? `قناة ${active} قيد التشغيل` : "لم تبدأ البث — اختر قناة"}</div>
                  {error && <div className="text-sm text-yellow-300">{error}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => { const ch = channels.find(c => c.id === active); if (ch) playChannel(ch); }} className="px-3 py-2 bg-cyan-500 rounded-lg text-sm font-bold">إعادة تشغيل</button>
                  <button onClick={toggleMute} className="px-3 py-2 bg-white/6 rounded-lg text-sm">{muted ? 'إلغاء كتم' : 'كتم'}</button>
                </div>
              </div>
            </div>

            {/* small info cards below player */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/6">
                <h5 className="text-cyan-300 font-black">تخريفات المستر</h5>
                <p className="text-sm text-gray-300 mt-2">مساحة العرض للمقال أو وصف البث.</p>
              </div>

              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/6">
                <h5 className="text-cyan-300 font-black">ملاحظات</h5>
                <p className="text-sm text-gray-300 mt-2">إن تعذّر التشغيل: قد يكون السبب CORS أو رفض من مصدر البث.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-[1200px] mt-8 text-center text-xs text-gray-400">
          © 2026 MISTERAI LIVE — جميع الحقوق محفوظة — MisterAI_Security
        </footer>
      </main>
    </>
  );
}
