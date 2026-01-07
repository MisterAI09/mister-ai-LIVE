import Head from "next/head";
import { useEffect, useRef, useState } from "react";

/**
 * Responsive "mister-ai-live" UI inspired by the image:
 * - Dark maroon background
 * - Animated teal logo top-right
 * - Large centered player (with play overlay)
 * - Glowing rounded channel buttons below (grid on desktop, horizontal scroller on mobile)
 * - Footer with copyright
 *
 * Place this file in pages/index.js of your Next.js project (mister-ai-LIVE).
 * Ensure your proxy API /api/streams/[...path].js exists so channel URLs like
 * "/api/streams/beinsport1_.m3u8" work.
 */

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  // Channels - update titles/urls as you like
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

  // Load hls.js client-side
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    s.onload = () => {};
    s.onerror = () => setError("فشل تحميل مشغل الفيديو (HLS).");
    document.body.appendChild(s);
    return () => {
      try { document.body.removeChild(s); } catch {}
    };
  }, []);

  // Play channel using native HLS (Safari) or hls.js
  function playChannel(ch) {
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    // Native HLS (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      try { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } } catch {}
      video.src = ch.url;
      video.load();
      video.muted = muted;
      video.play().catch(()=>{});
      return;
    }

    const Hls = window.Hls;
    if (!Hls) {
      setError("المشغل غير محمل، حاول مرة أخرى بعد ثوانٍ.");
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
        video.play().catch(()=>{});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS error", data);
        if (data && data.type === "networkError") setError("فشل جلب البث — مشكلة في الشبكة أو المصدر.");
      });
    } else {
      setError("متصفحك لا يدعم تشغيل HLS.");
    }
  }

  function handleOverlayPlay() {
    // If no active, play first channel
    const ch = active ? channels.find(c => c.id === active) : channels[0];
    if (ch) playChannel(ch);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  // Clean up HLS on unmount
  useEffect(() => {
    return () => {
      try { if (hlsRef.current) hlsRef.current.destroy(); } catch {}
    };
  }, []);

  return (
    <>
      <Head>
        <title>mister-ai-live</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          :root{
            --bg:#210606; /* dark maroon */
            --teal:#00e0d6;
            --teal-2:#00c6ff;
            --button-bg: rgba(0,200,255,0.08);
            --button-inner: rgba(0,200,255,0.14);
          }
          html,body,#__next { height: 100%; }
          body{
            margin:0;
            font-family: 'Cairo', sans-serif;
            background: radial-gradient(circle at 20% 10%, rgba(255,255,255,0.02), transparent 8%), var(--bg);
            color: #e8eef6;
            -webkit-font-smoothing:antialiased;
            -moz-osx-font-smoothing:grayscale;
          }

          /* top-right animated logo */
          .logo-wrap { position: absolute; top: 22px; right: 26px; z-index: 40; display:flex; align-items:center; gap:10px; }
          .tv-icon {
            width: 56px; height: 56px; display:inline-grid; place-items:center;
            background: linear-gradient(135deg, var(--teal), var(--teal-2));
            border-radius: 10px; box-shadow: 0 8px 30px rgba(0,200,255,0.12);
            transform: rotate(-6deg);
          }
          .logo-text {
            font-weight:900; color: var(--teal); letter-spacing: .06em;
            background: linear-gradient(90deg, var(--teal), var(--teal-2));
            -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
            animation: glowLogo 6s linear infinite;
            font-size: 14px;
          }
          @keyframes glowLogo { 0%{ filter: drop-shadow(0 0 6px rgba(0,200,255,0.12)); } 50%{ filter: drop-shadow(0 0 18px rgba(0,200,255,0.22)); } 100%{ filter: drop-shadow(0 0 6px rgba(0,200,255,0.12)); } }

          /* center player frame */
          .screen-wrap {
            width: 100%;
            max-width: 980px;
            margin: 28px auto 12px;
            border-radius: 18px;
            padding: 12px;
            background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.003));
            box-shadow: 0 30px 80px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,160,220,0.02);
            border: 1px solid rgba(0,200,255,0.06);
          }

          .player {
            background: #000;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            height: clamp(220px, 46vh, 560px);
          }

          .play-overlay {
            position: absolute;
            inset: 0;
            display:flex;
            align-items:center;
            justify-content:center;
            z-index: 10;
            cursor: pointer;
            transition: opacity .18s;
          }
          .play-btn {
            width: 84px; height: 84px; border-radius: 999px;
            background: rgba(0,0,0,0.6);
            display:grid; place-items:center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,200,255,0.12);
            border: 2px solid rgba(0,200,255,0.12);
          }
          .play-btn svg { width: 38px; height: 38px; fill: var(--teal); transform: translateX(3px); }

          /* channel buttons grid */
          .channels-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0,1fr));
            gap: 14px;
            margin-top: 18px;
          }
          .ch-btn {
            border-radius: 14px;
            padding: 12px 10px;
            background: linear-gradient(180deg, var(--button-inner), rgba(0,0,0,0.08));
            border: 1px solid rgba(0,200,255,0.09);
            box-shadow: 0 8px 30px rgba(0,200,255,0.04), 0 6px 18px rgba(0,0,0,0.5);
            color: #e9fbff;
            font-weight: 800;
            text-align:center;
            cursor: pointer;
            transition: transform .12s, box-shadow .12s, background .12s;
          }
          .ch-btn:hover { transform: translateY(-6px); box-shadow: 0 22px 60px rgba(0,200,255,0.10); }
          .ch-active {
            background: linear-gradient(180deg, rgba(0,230,210,0.12), rgba(0,200,255,0.06));
            border-color: rgba(0,255,210,0.22);
            box-shadow: 0 28px 80px rgba(0,200,255,0.14);
            color: #001217;
          }

          /* responsive for smaller screens */
          @media (max-width: 1000px) {
            .channels-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; }
            .logo-wrap { right: 16px; top: 16px; }
          }
          @media (max-width: 720px) {
            .channels-grid { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
            .ch-btn { min-width: 140px; flex: 0 0 auto; }
            .logo-wrap { right: 12px; top: 12px; }
            .screen-wrap { margin-top: 12px; padding: 10px; }
          }

          /* footer */
          .site-footer { margin-top: 28px; text-align:center; color: #9fb8bf; font-size: 12px; opacity: 0.9; }
        `}</style>
      </Head>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        {/* Animated logo top-right */}
        <div className="logo-wrap" aria-hidden>
          <div className="tv-icon" role="img" aria-label="tv">
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 34, height: 34 }}>
              <rect x="2" y="3" width="20" height="14" rx="2" fill="white" opacity="0.06"></rect>
              <path d="M7 9l5 3-5 3V9z" fill="#001217" opacity="0.96"></path>
            </svg>
          </div>
          <div className="logo-text">MISTER-AI-LIVE</div>
        </div>

        <main dir="rtl" className="flex flex-col items-center pt-14 pb-12 px-4">
          {/* centered player */}
          <div className="screen-wrap w-full">
            <div className="player">
              <video
                ref={videoRef}
                id="tvPlayer"
                controls
                playsInline
                className="w-full h-full object-cover"
                style={{ background: "#000" }}
              />
              {/* overlay play button (click to start first/active channel) */}
              <div className="play-overlay" onClick={handleOverlayPlay} aria-hidden>
                <div className="play-btn" title="تشغيل">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3v18l15-9L5 3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* below player controls */}
            <div className="flex items-center justify-between mt-3 px-2">
              <div className="text-sm text-gray-300">{active ? `قناة ${active} قيد التشغيل` : "اضغط زر التشغيل أو اختر قناة"}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => { const ch = channels.find(c => c.id === active); if (ch) playChannel(ch); }} className="px-3 py-1 rounded-lg bg-white/6 text-sm">إعادة تشغيل</button>
                <button onClick={toggleMute} className="px-3 py-1 rounded-lg bg-white/6 text-sm">{muted ? "إلغاء كتم" : "كتم"}</button>
              </div>
            </div>
          </div>

          {/* channels buttons (grid desktop, scroll mobile) */}
          <div className="w-full max-w-[980px] mt-6">
            <div className="channels-grid">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => playChannel(ch)}
                  className={`ch-btn ${active === ch.id ? "ch-active" : ""}`}
                  aria-pressed={active === ch.id}
                  title={ch.title}
                >
                  <div style={{ fontSize: 14 }}>{ch.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 6 }}>قناة {ch.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* optional error message */}
          {error && <div className="mt-4 text-sm text-yellow-300">{error}</div>}

          {/* footer */}
          <footer className="site-footer">
            © 2026 MISTERAI LIVE — جميع الحقوق محفوظة — MisterAI_Security
          </footer>
        </main>
      </div>
    </>
  );
}
