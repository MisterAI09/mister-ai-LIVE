import Head from "next/head";
import { useEffect, useRef, useState } from "react";

/*
  Modern responsive UI for mister-ai-live
  - Replace pages/index.js with this file
  - Ensure /api/streams/[...path].js exists (proxy to your m3u8)
*/

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const starCanvasRef = useRef(null);

  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  // Channels: edit titles/urls as needed
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
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // Lightweight starfield for background (mobile-friendly)
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const stars = [];
    const COUNT = Math.max(40, Math.round((w * h) / 40000)); // adaptive but light

    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.8 + 0.2,
        dx: (Math.random() - 0.5) * 0.1
      });
    }

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener("resize", resize);

    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      // subtle gradient background (maroon tone)
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#200607");
      g.addColorStop(1, "#0b0101");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // draw stars
      for (let s of stars) {
        s.x += s.dx;
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        s.a += (Math.random() - 0.5) * 0.02;
        if (s.a < 0.15) s.a = 0.15;
        if (s.a > 1) s.a = 1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(0,200,255,${s.a * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0,160,255,0.6)";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Play channel: native or hls.js
  function playChannel(ch) {
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      try { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } } catch {}
      video.src = ch.url;
      video.muted = muted;
      video.play().catch(()=> {});
      return;
    }

    const Hls = window.Hls;
    if (!Hls) { setError("جاري تحميل مشغل الفيديو — أعد المحاولة بعد قليل"); return; }

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
        video.play().catch(()=> {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS error", data);
        if (data && data.type === "networkError") setError("فشل جلب البث — تحقق من المصدر أو الشبكة.");
      });
    } else {
      setError("متصفحك لا يدعم HLS.");
    }
  }

  function overlayPlay() {
    // play active or first
    const ch = active ? channels.find(c => c.id === active) : channels[0];
    if (ch) playChannel(ch);
  }

  function toggleMute() {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  }

  // Clean HLS on unmount
  useEffect(() => {
    return () => { try { if (hlsRef.current) hlsRef.current.destroy(); } catch {} };
  }, []);

  return (
    <>
      <Head>
        <title>mister-ai-live — بث مباشر</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          :root{
            --bg-dark: #1b0304;
            --teal: #00d9cf;
            --teal-2: #00afff;
            --accent-bg: rgba(0,200,255,0.08);
          }
          html,body,#__next{height:100%}
          body{ margin:0; font-family:'Cairo',sans-serif; -webkit-font-smoothing:antialiased; background:transparent; color:#e7f6f9; }

          /* Top-right animated logo */
          .logo-top {
            position: fixed; top: 20px; right: 24px; z-index:60; display:flex; align-items:center; gap:10px;
            pointer-events: none;
          }
          .logo-top .tv {
            pointer-events:auto;
            width:56px; height:56px; border-radius:10px;
            display:grid; place-items:center;
            background: linear-gradient(135deg, var(--teal), var(--teal-2));
            box-shadow: 0 12px 40px rgba(0,180,220,0.14);
            transform: rotate(-6deg);
          }
          .logo-top .text {
            font-weight:900; font-size:14px;
            background: linear-gradient(90deg, var(--teal), var(--teal-2));
            -webkit-background-clip:text; color:transparent;
            animation: pulseLogo 6s ease-in-out infinite;
          }
          @keyframes pulseLogo {
            0% { filter: drop-shadow(0 0 6px rgba(0,200,255,0.08)); transform: scale(1) rotate(-6deg); }
            50% { filter: drop-shadow(0 0 18px rgba(0,200,255,0.18)); transform: scale(1.02) rotate(-6.5deg); }
            100% { filter: drop-shadow(0 0 6px rgba(0,200,255,0.08)); transform: scale(1) rotate(-6deg); }
          }

          /* central container */
          .container {
            position: relative;
            max-width: 1100px;
            margin: 90px auto 40px;
            padding: 20px;
            border-radius: 20px;
            background: rgba(0,0,0,0.3);
            box-shadow: 0 40px 100px rgba(0,0,0,0.7);
            border: 1px solid rgba(255,255,255,0.02);
          }

          /* "laptop" frame */
          .laptop-frame {
            border-radius: 14px;
            padding: 10px;
            background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.003));
            border: 1px solid rgba(255,255,255,0.02);
            box-shadow: inset 0 0 40px rgba(0,160,240,0.02);
          }
          .laptop-top {
            height: calc(min(60vh, 520px));
            background: #000;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
          }
          .laptop-bottom {
            height: 22px; margin-top: 12px; border-radius: 8px;
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            box-shadow: 0 6px 20px rgba(0,0,0,0.6) inset;
            display:flex; align-items:center; justify-content:center;
            color: rgba(255,255,255,0.35);
            font-weight:700;
          }

          /* play overlay */
          .play-overlay {
            position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:30;
            cursor:pointer;
            transition: opacity .16s;
          }
          .play-circle {
            width:88px; height:88px; border-radius:999px; display:grid; place-items:center;
            background: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.45));
            border: 2px solid rgba(0,200,255,0.12);
            box-shadow: 0 28px 60px rgba(0,200,255,0.08);
          }
          .play-triangle { width:38px; height:38px; fill: var(--teal); transform: translateX(4px); }

          /* channels grid */
          .channels {
            margin-top: 18px;
            display:grid;
            grid-template-columns: repeat(5, minmax(0,1fr));
            gap: 14px;
            align-items:stretch;
          }
          .ch {
            border-radius: 14px;
            padding: 12px 10px;
            text-align:center;
            background: linear-gradient(180deg, rgba(0,200,255,0.06), rgba(0,0,0,0.08));
            border: 1px solid rgba(0,200,255,0.09);
            box-shadow: 0 10px 30px rgba(0,200,255,0.03);
            transition: transform .12s, box-shadow .12s, background .12s;
            cursor:pointer;
            font-weight:800;
          }
          .ch:hover { transform: translateY(-6px); box-shadow: 0 28px 80px rgba(0,200,255,0.08); }
          .ch.active {
            background: linear-gradient(180deg, rgba(0,230,210,0.14), rgba(0,200,255,0.06));
            color: #001217;
            border-color: rgba(0,255,210,0.18);
            box-shadow: 0 32px 100px rgba(0,200,255,0.12);
          }

          /* responsive */
          @media (max-width: 1000px) {
            .channels { grid-template-columns: repeat(4, minmax(0,1fr)); }
            .container { margin-top: 70px; padding: 16px; }
          }
          @media (max-width: 720px) {
            .channels { display:flex; gap:12px; overflow-x:auto; padding-bottom:8px; }
            .ch { min-width: 140px; flex:0 0 auto; }
            .container { margin-top: 60px; }
          }

          /* footer */
          .footer { margin-top: 18px; text-align:center; color:#9fb8bf; font-size:13px; }
        `}</style>
      </Head>

      {/* background star canvas (full screen) */}
      <canvas ref={starCanvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* top-right logo */}
      <div className="logo-top" aria-hidden>
        <div className="tv" title="Mister AI Live logo" role="img">
          <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="4" width="21" height="14" rx="2.2" fill="rgba(255,255,255,0.08)"/>
            <path d="M7 9l5 3-5 3V9z" fill="#001217"/>
          </svg>
        </div>
        <div className="text">MISTER-AI-LIVE</div>
      </div>

      {/* main */}
      <main style={{ position: "relative", zIndex: 10 }}>
        <div className="container" role="main" aria-label="Mister AI Live container">
          <div className="laptop-frame">
            <div className="laptop-top" role="region" aria-label="Video player area">
              <video
                ref={videoRef}
                id="tvPlayer"
                controls
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}
                aria-label="مشغل الفيديو"
              />
              <div className="play-overlay" onClick={overlayPlay} aria-hidden>
                <div className="play-circle" title="تشغيل">
                  <svg className="play-triangle" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v18l15-9L5 3z"/></svg>
                </div>
              </div>
            </div>

            <div className="laptop-bottom">MISTER-AI-LIVE · بث مباشر</div>
          </div>

          {/* channel buttons */}
          <div className="channels" role="list" aria-label="قنوات">
            {channels.map((ch) => (
              <button
                key={ch.id}
                className={`ch ${active === ch.id ? "active" : ""}`}
                onClick={() => playChannel(ch)}
                aria-pressed={active === ch.id}
                role="listitem"
                title={ch.title}
              >
                <div style={{ fontSize: 14 }}>{ch.title}</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>قناة {ch.id}</div>
              </button>
            ))}
          </div>

          {error && <div style={{ marginTop: 12, color: "#ffd580", textAlign: "center" }}>{error}</div>}

          <div className="footer">© 2026 MISTERAI LIVE — جميع الحقوق محفوظة — MisterAI_Security</div>
        </div>
      </main>
    </>
  );
}
