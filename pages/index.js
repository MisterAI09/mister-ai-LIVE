import Head from "next/head";
import { useEffect, useRef, useState } from "react";

/*
  Clean, responsive UI matching the provided mock (Image 2).
  - Put in pages/index.js
  - Ensure /api/streams/... proxy exists for real m3u8 streams,
    or temporarily replace channel.url with a direct mp4 for testing.
*/

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  // Channels: change url -> real /api/streams/... or test mp4
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

  // NOTE: For quick local test, uncomment one sample mp4 and comment m3u8 urls above:
  // channels[0].url = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  // load hls.js dynamically
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    s.onload = () => console.log("hls.js loaded");
    s.onerror = () => console.warn("hls.js failed to load (still may work with native HLS).");
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // play logic (native HLS or hls.js)
  function playChannel(ch) {
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    // If it's a plain mp4 the video element will play directly.
    // For .m3u8: native Safari supports it; other browsers need hls.js.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native
      try { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } } catch {}
      video.src = ch.url;
      video.muted = muted;
      video.play().catch(() => {});
      return;
    }

    const Hls = window.Hls;
    if (!Hls) {
      // If not loaded, still attempt to set src (may work for mp4)
      video.src = ch.url;
      video.muted = muted;
      video.play().catch(()=> setError("تعذر تشغيل البث — جرّب تشغيل ملف mp4 للاختبار أو تأكد من hls.js/proxy."));
      return;
    }

    // use hls.js
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
        if (data && data.type === "networkError") setError("خطأ شبكة عند جلب البث. تحقق من الـ proxy/رابط المصدر.");
      });
    } else {
      setError("متصفحك لا يدعم تشغيل HLS.");
    }
  }

  function overlayPlay() {
    const ch = active ? channels.find(c => c.id === active) : channels[0];
    if (ch) playChannel(ch);
  }

  function toggleMute() {
    const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted);
  }

  // cleanup hls on unmount
  useEffect(() => {
    return () => { try { if (hlsRef.current) hlsRef.current.destroy(); } catch {} };
  }, []);

  return (
    <>
      <Head>
        <title>MISTER-AI-LIVE — واجهة جديدة</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root{
            --bg:#220404; /* dark maroon */
            --teal:#00e0d6;
            --teal2:#00bfff;
            --btn-inner: rgba(0,200,255,0.08);
          }
          html,body,#_next{height:100%}
          body{ margin:0; font-family: 'Cairo', sans-serif; background: radial-gradient(circle at 10% 10%, rgba(255,255,255,0.02), transparent 8%), var(--bg); color:#eef8f9; -webkit-font-smoothing:antialiased;}

          /* top-right animated logo */
          .logo {
            position: fixed; top:18px; right:18px; z-index:40; display:flex; align-items:center; gap:10px;
          }
          .logo .tv {
            width:56px; height:56px; border-radius:12px;
            display:grid; place-items:center;
            background: linear-gradient(135deg, var(--teal), var(--teal2));
            box-shadow: 0 12px 40px rgba(0,180,220,0.12);
            transform: rotate(-6deg);
          }
          .logo .text { font-weight:900; background: linear-gradient(90deg,var(--teal),var(--teal2)); -webkit-background-clip:text; color:transparent; font-size:14px; }

          .page {
            min-height:100vh; display:flex; align-items:center; justify-content:center; padding:36px 18px; box-sizing:border-box;
          }

          .card {
            width:100%; max-width:980px; background: rgba(0,0,0,0.26); border-radius:18px; padding:18px; box-shadow: 0 40px 120px rgba(0,0,0,0.7);
            border:1px solid rgba(255,255,255,0.02);
          }

          /* laptop-like player */
          .player-wrap { border-radius:14px; padding:12px; background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005)); border:1px solid rgba(255,255,255,0.02); }
          .screen { background:#000; border-radius:10px; overflow:hidden; height: clamp(220px, 46vh, 520px); position:relative; }
          .laptop-base { height:20px; margin-top:12px; border-radius:8px; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.35); font-weight:700; }

          .overlay-play { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:30; cursor:pointer; }
          .play-circle { width:84px; height:84px; border-radius:999px; display:grid; place-items:center; background: rgba(0,0,0,0.6); border:2px solid rgba(0,200,255,0.12); box-shadow: 0 24px 60px rgba(0,200,255,0.08); }
          .play-icon { width:40px; height:40px; fill: var(--teal); transform: translateX(4px); }

          /* channels buttons */
          .channels { margin-top:18px; display:grid; grid-template-columns: repeat(5, 1fr); gap:14px; }
          .ch {
            border-radius:14px; padding:12px; text-align:center; background: linear-gradient(180deg, var(--btn-inner), rgba(0,0,0,0.08)); border:1px solid rgba(0,200,255,0.09); box-shadow: 0 12px 30px rgba(0,200,255,0.03); cursor:pointer; font-weight:800;
          }
          .ch:hover { transform: translateY(-6px); transition: all .12s; box-shadow: 0 28px 80px rgba(0,200,255,0.08); }
          .ch.active { background: linear-gradient(180deg, rgba(0,230,210,0.14), rgba(0,200,255,0.06)); color:#001217; border-color: rgba(0,255,210,0.18); box-shadow: 0 32px 100px rgba(0,200,255,0.12); }

          /* responsiveness */
          @media (max-width:1000px) { .channels { grid-template-columns: repeat(4, 1fr); } }
          @media (max-width:720px) { .channels { display:flex; gap:12px; overflow-x:auto; padding-bottom:8px; } .ch { min-width:140px; flex:0 0 auto; } .card { padding:12px; } }

          .controls { display:flex; gap:8px; align-items:center; justify-content:flex-end; margin-top:10px; }
          .btn { padding:8px 12px; border-radius:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.03); cursor:pointer; font-weight:700; }

          .footer { margin-top:14px; text-align:center; color:#9fb8bf; font-size:13px; }
        `}</style>
      </Head>

      <div className="page">
        {/* logo */}
        <div className="logo" aria-hidden>
          <div className="tv" title="Mister AI Live">
            <svg viewBox="0 0 24 24" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.5" y="4" width="21" height="14" rx="2.2" fill="rgba(255,255,255,0.08)"/>
              <path d="M7 9l5 3-5 3V9z" fill="#001217"/>
            </svg>
          </div>
          <div className="text">MISTER-AI-LIVE</div>
        </div>

        <div className="card" role="main">
          <div className="player-wrap">
            <div className="screen" aria-label="Video player area">
              <video ref={videoRef} controls playsInline style={{ width:"100%", height:"100%", objectFit:"cover", background:"#000" }} />
              <div className="overlay-play" onClick={overlayPlay} aria-hidden>
                <div className="play-circle" title="تشغيل">
                  <svg className="play-icon" viewBox="0 0 24 24"><path d="M5 3v18l15-9L5 3z"/></svg>
                </div>
              </div>
            </div>
            <div className="laptop-base">MISTER-AI-LIVE — بث مباشر</div>
          </div>

          <div className="channels" role="list" aria-label="قائمة القنوات">
            {channels.map((ch) => (
              <button
                key={ch.id}
                className={`ch ${active === ch.id ? "active" : ""}`}
                onClick={() => playChannel(ch)}
                aria-pressed={active === ch.id}
                role="listitem"
                title={ch.title}
              >
                <div style={{fontSize:14}}>{ch.title}</div>
                <div style={{fontSize:12, opacity:0.85, marginTop:6}}>قناة {ch.id}</div>
              </button>
            ))}
          </div>

          <div className="controls">
            <div className="btn" onClick={() => { const ch = channels.find(c => c.id === active); if (ch) playChannel(ch); }}>إعادة تشغيل</div>
            <div className="btn" onClick={toggleMute}>{muted ? "إلغاء كتم" : "كتم"}</div>
          </div>

          {error && <div style={{ marginTop:12, color:"#ffd580", textAlign:"center" }}>{error}</div>}

          <div className="footer">© 2026 MISTERAI LIVE — جميع الحقوق محفوظة — MisterAI_Security</div>
        </div>
      </div>
    </>
  );
}
