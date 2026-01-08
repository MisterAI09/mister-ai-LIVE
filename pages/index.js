import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  const channels = [
    { id: "1", title: "|CAN|AR beIN SPORTS Max 1 ❹Ⓚ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432904.m3u8" },
    { id: "2", title: "|CAN|AR beIN SPORTS Max 1 ⒻⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432903.m3u8" },
    { id: "3", title: "|CAN|AR beIN SPORTS Max 1 ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432902.m3u8" },
    { id: "4", title: "|CAN|AR beIN SPORTS Max 1 ⓈⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432901.m3u8" },
    { id: "5", title: "|CAN|AR beIN SPORTS Max 2 ❹Ⓚ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432900.m3u8" },
    { id: "6", title: "|CAN|AR beIN SPORTS Max 2 ⒻⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432899.m3u8" },
    { id: "7", title: "|CAN|AR beIN SPORTS Max 2 ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432898.m3u8" },
    { id: "8", title: "|CAN|AR beIN SPORTS Max 2 ⓈⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432897.m3u8" },
    { id: "9", title: "|CAN|EN beIN SPORTS Max 3 ❹Ⓚ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432896.m3u8" },
    { id: "10", title: "|CAN|EN beIN SPORTS Max 3 ⒻⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432895.m3u8" },
    { id: "11", title: "|CAN|EN beIN SPORTS Max 3 ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432894.m3u8" },
    { id: "12", title: "|CAN|AR beIN SPORTS Max 3 ⓈⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432893.m3u8" },
    { id: "13", title: "|CAN|FR beIN SPORTS MAX 4 ❹Ⓚ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432892.m3u8" },
    { id: "14", title: "|CAN|FR beIN SPORTS MAX 4 ⒻⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432891.m3u8" },
    { id: "15", title: "|CAN|FR beIN SPORTS MAX 4 ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432890.m3u8" },
    { id: "16", title: "|CAN|FR beIN SPORTS MAX 4 ⓈⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432889.m3u8" },
    { id: "17", title: "|CAN|DZ PROGRAMME NATIONAL ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432888.m3u8" },
    { id: "18", title: "|CAN|FR CANAL+ CAN ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432884.m3u8" },
    { id: "19", title: "|CAN|FR beIN SPORTS 1 ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432883.m3u8" },
    { id: "20", title: "|CAN|FR beIN SPORTS 2 ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432882.m3u8" },
    { id: "21", title: "|CAN|ES LALIGA+ TV ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432881.m3u8" },
    { id: "22", title: "|DZ| EL BILAD TV", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/351100.m3u8" },
    { id: "23", title: "|DZ| ALGERIE 6", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/327314.m3u8" },
    { id: "24", title: "|DZ| ALGERIE 8", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/295979.m3u8" },
    { id: "25", title: "|DZ| AL 24 NEWS", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/295221.m3u8" },
    { id: "26", title: "|DZ| ALGERIE 7", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/152921.m3u8" },
    { id: "27", title: "|DZ| CANAL ALGERIE", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1687.m3u8" },
    { id: "28", title: "|DZ| A3 ALGERIE", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1675.m3u8" },
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
        <title>𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄 — Premium Experience</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg: #050505;
            --accent: #00f2ea;
            --accent-glow: rgba(0, 242, 234, 0.5);
            --glass: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
          }
          body { 
            margin:0; font-family: 'Cairo', sans-serif; background: var(--bg); color:#fff;
            background-image: 
                radial-gradient(circle at 20% 20%, #1a0505 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, #05161a 0%, transparent 40%);
            overflow-x: hidden;
          }

          /* Global Container */
          .main-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
          }

          /* Enhanced Glowing Logo */
          .logo-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 40px;
            position: relative;
          }
          .logo-glow-effect {
            position: absolute;
            width: 120px; height: 120px;
            background: var(--accent);
            filter: blur(60px);
            opacity: 0.2;
            animation: pulse 4s infinite;
          }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.5); opacity: 0.3; } }

          .logo-box-main {
            width: 70px; height: 70px;
            background: linear-gradient(135deg, #00f2ea, #0077ff);
            border-radius: 20px;
            display: grid; place-items: center;
            box-shadow: 0 0 30px var(--accent-glow);
            margin-bottom: 15px;
            animation: rotateFloat 6s infinite ease-in-out;
            z-index: 2;
          }
          @keyframes rotateFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          .logo-text-main { 
            font-weight: 900; font-size: 28px; letter-spacing: 2px;
            background: linear-gradient(to bottom, #fff, #888);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 10px 20px rgba(0,0,0,0.5);
          }

          /* Professional Video Player Layout */
          .player-section {
            width: 100%; max-width: 1100px;
            position: relative;
            background: #000;
            border-radius: 24px;
            padding: 10px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 40px 100px rgba(0,0,0,0.9);
          }
          .video-container {
            aspect-ratio: 16/9;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            background: #000;
          }
          
          /* Shiny Buttons Style */
          .channels-container {
            width: 100%; max-width: 1100px;
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
          }
          .channel-card {
            background: var(--glass);
            border: 1px solid var(--glass-border);
            padding: 20px;
            border-radius: 18px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            text-align: center;
          }
          .channel-card::before {
            content: '';
            position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            transform: scale(0); transition: 0.6s;
          }
          .channel-card:hover {
            background: rgba(255,255,255,0.07);
            border-color: var(--accent);
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.4);
          }
          .channel-card:hover::before { transform: scale(1); }
          .channel-card.active {
            background: linear-gradient(135deg, var(--accent), #0077ff);
            border: none;
            box-shadow: 0 10px 25px var(--accent-glow);
          }
          .channel-card.active .ch-title { color: #000; }
          .channel-card.active .ch-sub { color: rgba(0,0,0,0.6); }

          .ch-title { font-weight: 800; font-size: 14px; margin-bottom: 5px; color: #eee; transition: 0.3s; }
          .ch-sub { font-size: 10px; color: #666; font-weight: 600; text-transform: uppercase; }

          /* Bottom Control Bar */
          .premium-controls {
            display: flex; flex-wrap: wrap; gap: 15px; margin-top: 30px;
          }
          .btn-shiny {
            padding: 12px 30px;
            border-radius: 50px;
            border: 1px solid var(--glass-border);
            background: var(--glass);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
            backdrop-filter: blur(10px);
            display: flex; align-items: center; gap: 8px;
          }
          .btn-shiny:hover {
            background: #fff; color: #000;
            box-shadow: 0 0 20px rgba(255,255,255,0.4);
          }

          .footer-text {
            margin-top: 60px;
            opacity: 0.3;
            font-size: 11px;
            letter-spacing: 3px;
            text-align: center;
          }
          
          /* Error Toast */
          .error-msg {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: #ff3e3e; color: #fff; padding: 10px 25px; border-radius: 10px;
            font-weight: bold; box-shadow: 0 10px 20px rgba(0,0,0,0.3); z-index: 100;
          }
        `}</style>
      </Head>

      <div className="main-wrapper">
        {/* Logo Section */}
        <div className="logo-area">
          <div className="logo-glow-effect"></div>
          <div className="logo-box-main">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#000">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7l7 4z"/>
            </svg>
          </div>
          <div className="logo-text-main">𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄</div>
        </div>

        {/* Video Section */}
        <div className="player-section">
          <div className="video-container">
            <video ref={videoRef} controls playsInline style={{ width:"100%", height:"100%" }} />
            {!active && (
              <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.9)", backdropFilter: 'blur(10px)'}}>
                <button 
                    onClick={() => playChannel(channels[0])} 
                    className="btn-shiny" 
                    style={{background: 'var(--accent)', color: '#000', border:'none', padding: '15px 40px', fontSize: '18px'}}
                >
                    ▶ بـدء الـبـث الـمـبـاشـر
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="premium-controls">
          <button className="btn-shiny" onClick={() => { if(active) playChannel(channels.find(c => c.id === active)) }}>
            <span>🔄</span> تحديث البث
          </button>
          <button className="btn-shiny" onClick={toggleMute}>
            <span>{muted ? "🔈" : "🔇"}</span> {muted ? "تشغيل الصوت" : "كتم الصوت"}
          </button>
          <a href="https://x.com/neurosisnet" target="_blank" rel="noreferrer" className="btn-shiny" style={{textDecoration:'none'}}>
             🐦 منصة X
          </a>
        </div>

        {/* Channels Grid */}
        <div className="channels-container">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className={`channel-card ${active === ch.id ? "active" : ""}`}
              onClick={() => playChannel(ch)}
            >
              <div className="ch-title">{ch.title.split(' ').slice(0, 4).join(' ')}</div>
              <div className="ch-sub">Quality: {ch.title.includes('❹Ⓚ') ? '4K Ultra HD' : 'Full HD'}</div>
            </div>
          ))}
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <div className="footer-text">
          PREMIUM IPTV INTERFACE • DESIGNED BY MUSTAPHA • 2026
        </div>
      </div>
    </>
  );
}
