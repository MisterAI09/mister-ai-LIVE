import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);

  // القنوات الأصلية كما هي في ملفك index.js وبدون أي تغيير في الروابط
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
    { id: "28", title: "|DZ| A3 ALGERIE", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1675.m3u8" }
  ];

  // دالة تشغيل الفيديو الأصلية التي جعلتها أنت تعمل
  function playChannel(ch) {
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = ch.url;
      video.play();
    } else if (window.Hls && window.Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new window.Hls();
      hls.loadSource(ch.url);
      hls.attachMedia(video);
      hlsRef.current = hls;
      video.play();
    }
  }

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="container">
      <Head>
        <title>𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄 | Premium</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root { --accent: #00e0d6; --bg: #050505; }
          body { margin: 0; background: var(--bg); color: white; font-family: 'Cairo', sans-serif; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; text-align: center; }
          
          .header { padding: 20px 0; border-bottom: 1px solid #1a1a1a; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: 900; color: var(--accent); text-shadow: 0 0 10px rgba(0,224,214,0.3); letter-spacing: 2px; }
          
          .player-section { 
            background: #000; border: 1px solid #222; border-radius: 20px; 
            overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); 
            margin-bottom: 30px; position: relative;
          }
          video { width: 100%; aspect-ratio: 16/9; display: block; }

          .grid-title { text-align: left; font-size: 14px; opacity: 0.5; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; }
          .channels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
          
          .channel-btn {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
            color: #888; padding: 15px; border-radius: 12px; cursor: pointer;
            transition: 0.3s; font-weight: bold; font-size: 13px;
          }
          .channel-btn:hover { background: rgba(255,255,255,0.08); border-color: var(--accent); color: white; transform: translateY(-3px); }
          .channel-btn.active { background: var(--accent); color: black; border-color: var(--accent); box-shadow: 0 0 15px var(--accent); }

          .footer { margin-top: 50px; padding: 20px; opacity: 0.2; font-size: 10px; border-top: 1px solid #111; }
        `}</style>
      </Head>

      <div className="header">
        <div className="logo">𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄</div>
      </div>

      <div className="player-section">
        <video ref={videoRef} controls autoPlay />
      </div>

      <div className="grid-title">قائمة القنوات المميزة</div>
      <div className="channels-grid">
        {channels.map((ch) => (
          <button 
            key={ch.id} 
            className={`channel-btn ${active === ch.id ? 'active' : ''}`}
            onClick={() => playChannel(ch)}
          >
            {ch.title}
          </button>
        ))}
      </div>

      <div className="footer">DESIGNED BY MUSTAPHA — ALL RIGHTS RESERVED</div>
    </div>
  );
}
