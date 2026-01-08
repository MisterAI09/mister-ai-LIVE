import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  // القنوات كما هي في مستودع GitHub الخاص بك
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
    { id: "17", title: "|CAN|DZ PROGRAMME NATIONAL ALGÉRIE ⒽⒹ", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432888.m3u8" },
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

  // Logic: نفس طريقتك الأصلية السريعة
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
      video.src = ch.url;
      video.muted = muted;
      video.play().catch(() => {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new window.Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(ch.url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        video.muted = muted;
        video.play().catch(() => {});
      });
    }
  }

  return (
    <>
      <Head>
        <title>𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄 | Premium</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root { --main: #0b0202; --neon: #00e0d6; --card: rgba(255,255,255,0.03); }
          body { background: var(--main); color: white; font-family: 'Cairo', sans-serif; margin: 0; }
          
          .header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .logo { font-weight: 900; font-size: 22px; color: var(--neon); text-shadow: 0 0 10px var(--neon); }

          .layout { display: flex; flex-direction: column; align-items: center; padding: 20px; gap: 20px; }
          
          /* مشغل الفيديو بنمط احترافي */
          .player-box { width: 100%; max-width: 960px; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #222; }
          video { width: 100%; aspect-ratio: 16/9; display: block; }

          /* شبكة القنوات: مستوحاة من GitHub الخاص بك مع تحسين المظهر */
          .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
            gap: 12px; width: 100%; max-width: 960px; 
          }
          .card { 
            background: var(--card); border: 1px solid #222; border-radius: 8px; 
            padding: 15px; cursor: pointer; transition: 0.2s; text-align: center;
            font-size: 13px; font-weight: bold; color: #999;
          }
          .card:hover { border-color: var(--neon); color: #fff; background: rgba(0, 224, 214, 0.05); transform: translateY(-2px); }
          .card.active { background: var(--neon); color: #000; border-color: var(--neon); box-shadow: 0 0 15px rgba(0,224,214,0.3); }

          .controls { display: flex; gap: 10px; margin-top: 10px; }
          .btn-action { background: #1a1a1a; border: 1px solid #333; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
          .btn-action:hover { background: white; color: black; }
        `}</style>
      </Head>

      <div className="header">
        <div className="logo">𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄</div>
        <div style={{fontSize: 12, opacity: 0.5}}>Version 1.0.2</div>
      </div>

      <div className="layout">
        <div className="player-box">
          <video ref={videoRef} controls playsInline />
        </div>

        <div className="controls">
          <button className="btn-action" onClick={() => active && playChannel(channels.find(c=>c.id===active))}>إعادة تحميل</button>
          <button className="btn-action" onClick={() => {videoRef.current.muted = !videoRef.current.muted; setMuted(!muted)}}>{muted ? "🔇" : "🔊"}</button>
          <a href="https://x.com/neurosisnet" className="btn-action" style={{textDecoration:'none'}}>X Profile</a>
        </div>

        <div className="grid">
          {channels.map((ch) => (
            <div 
              key={ch.id} 
              className={`card ${active === ch.id ? 'active' : ''}`}
              onClick={() => playChannel(ch)}
            >
              {ch.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
