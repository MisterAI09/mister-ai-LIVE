import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  function playChannel(ch) {
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      try { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } } catch {}
      video.src = ch.url;
      video.muted = muted;
      video.play().catch(() => {});
      return;
    }

    const Hls = window.Hls;
    if (!Hls) {
      video.src = ch.url;
      video.muted = muted;
      video.play().catch(()=> setError("جاري تحميل المشغل..."));
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
        if (data && data.type === "networkError") setError("خطأ في جلب البث.");
      });
    }
  }

  function toggleMute() {
    const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted);
  }

  return (
    <>
      <Head>
        <title>🅼🅸🆂🆃🅴🆁-🅰🅸-🅻🅸🆅🅴 — Premium Interface</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg: #0b0202;
            --accent: #00e0d6;
            --accent-glow: rgba(0, 224, 214, 0.4);
          }
          body { 
            margin:0; font-family: 'Cairo', sans-serif; background: var(--bg); color:#fff;
            background-image: radial-gradient(circle at 50% -20%, #300a0a, transparent);
          }
          
          /* Animated Logo */
          .logo-container {
            position: fixed; top: 20px; right: 20px; z-index: 50; display: flex; align-items: center; gap: 12px;
          }
          .logo-box {
            width: 50px; height: 50px; background: linear-gradient(135deg, #00e0d6, #0077ff);
            border-radius: 12px; display: grid; place-items: center;
            animation: colorShift 5s infinite alternate, float 3s infinite ease-in-out;
            box-shadow: 0 0 20px var(--accent-glow);
          }
          @keyframes colorShift {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(90deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-5px) rotate(5deg); }
          }
          .logo-text { font-weight: 900; font-size: 18px; letter-spacing: 1px; color: #fff; text-shadow: 0 0 10px rgba(0,224,214,0.5); }

          .container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }

          /* Laptop Screen Mockup */
          .laptop-mockup {
            width: 100%; max-width: 900px; background: #1a1a1a; border: 8px solid #333;
            border-radius: 20px 20px 0 0; position: relative; box-shadow: 0 50px 100px rgba(0,0,0,0.8);
          }
          .screen-content { aspect-ratio: 16/9; background: #000; position: relative; overflow: hidden; }
          .laptop-bottom {
            width: 105%; height: 12px; background: linear-gradient(to bottom, #444, #222);
            border-radius: 0 0 20px 20px; margin-bottom: 30px; position: relative; left: -2.5%;
          }

          /* Channels Grid */
          .channels-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 15px; width: 100%; max-width: 900px; margin-top: 20px;
          }
          .channel-btn {
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            padding: 15px; border-radius: 15px; cursor: pointer; transition: 0.3s;
            color: #ccc; font-weight: 700;
          }
          .channel-btn:hover { background: rgba(0, 224, 214, 0.1); border-color: var(--accent); transform: translateY(-3px); color: #fff; }
          .channel-btn.active { background: var(--accent); color: #000; border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }

          .controls-bar {
            display: flex; gap: 15px; margin-top: 25px; width: 100%; max-width: 900px; justify-content: center;
          }
          .action-btn {
            padding: 10px 25px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; font-weight: bold; transition: 0.2s;
          }
          .action-btn:hover { background: #fff; color: #000; }
          
          .footer-note { margin-top: 40px; font-size: 12px; opacity: 0.4; letter-spacing: 2px; text-transform: uppercase; }
        `}</style>
      </Head>

      <div className="logo-container">
        <div className="logo-box">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="#000"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7l7 4z"/></svg>
        </div>
        <div className="logo-text">🅼🅸🆂🆃🅴🆁-🅰🅸-🅻🅸🆅🅴</div>
      </div>

      <div className="container">
        <div className="laptop-mockup">
          <div className="screen-content">
            <video ref={videoRef} controls playsInline style={{ width:"100%", height:"100%" }} />
            {!active && (
              <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.8)"}}>
                <button onClick={() => playChannel(channels[0])} className="action-btn" style={{background: 'var(--accent)', color: '#000', border:'none'}}>ابدأ البث الآن</button>
              </div>
            )}
          </div>
        </div>
        <div className="laptop-bottom"></div>

        <div className="channels-grid">
          {channels.map((ch) => (
            <button
              key={ch.id}
              className={`channel-btn ${active === ch.id ? "active" : ""}`}
              onClick={() => playChannel(ch)}
            >
              <div>{ch.title}</div>
              <div style={{fontSize:10, marginTop:4, opacity:0.7}}>BeIN Sports HD</div>
            </button>
          ))}
        </div>

        <div className="controls-bar">
          <button className="action-btn" onClick={() => { if(active) playChannel(channels.find(c => c.id === active)) }}>إعادة تحميل البث</button>
          <button className="action-btn" onClick={toggleMute}>{muted ? "🔈 تشغيل الصوت" : "🔇 كتم الصوت"}</button>
          <a href="https://x.com/neurosisnet" target="_blank" rel="noreferrer" className="action-btn" style={{textDecoration:'none', textAlign:'center'}}>حساب X</a>
        </div>

        {error && <div style={{color:"#ff4b4b", marginTop:20, fontWeight:"bold"}}>{error}</div>}

        <div className="footer-note italic">
          Design by MUSTAPHA — 2026 Security Version
        </div>
      </div>
    </>
  );
}
