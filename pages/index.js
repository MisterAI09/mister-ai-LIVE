import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);

  // جميع القنوات الـ 48 من مشروعك الأصلي مع توجيهها عبر البروكسي الخاص بك 
  const channels = [
    { id: "1", title: "|CAN|AR beIN SPORTS Max 1 ❹Ⓚ", path: "live/4476647188407159/4476647188407159/432904.m3u8" },
    { id: "2", title: "|CAN|AR beIN SPORTS Max 1 ⒻⒽⒹ", path: "live/4476647188407159/4476647188407159/432903.m3u8" },
    { id: "3", title: "|CAN|AR beIN SPORTS Max 1 ⒽⒹ", path: "live/4476647188407159/4476647188407159/432902.m3u8" },
    { id: "4", title: "|CAN|AR beIN SPORTS Max 1 ⓈⒹ", path: "live/4476647188407159/4476647188407159/432901.m3u8" },
    { id: "5", title: "|CAN|AR beIN SPORTS Max 2 ❹Ⓚ", path: "live/4476647188407159/4476647188407159/432900.m3u8" },
    { id: "6", title: "|CAN|AR beIN SPORTS Max 2 ⒻⒽⒹ", path: "live/4476647188407159/4476647188407159/432899.m3u8" },
    { id: "7", title: "|CAN|AR beIN SPORTS Max 2 ⒽⒹ", path: "live/4476647188407159/4476647188407159/432898.m3u8" },
    { id: "8", title: "|CAN|AR beIN SPORTS Max 2 ⓈⒹ", path: "live/4476647188407159/4476647188407159/432897.m3u8" },
    { id: "9", title: "|CAN|EN beIN SPORTS Max 3 ❹Ⓚ", path: "live/4476647188407159/4476647188407159/432896.m3u8" },
    { id: "10", title: "|CAN|EN beIN SPORTS Max 3 ⒻⒽⒹ", path: "live/4476647188407159/4476647188407159/432895.m3u8" },
    { id: "11", title: "|CAN|EN beIN SPORTS Max 3 ⒽⒹ", path: "live/4476647188407159/4476647188407159/432894.m3u8" },
    { id: "12", title: "|CAN|AR beIN SPORTS Max 3 ⓈⒹ", path: "live/4476647188407159/4476647188407159/432893.m3u8" },
    { id: "13", title: "|CAN|FR beIN SPORTS MAX 4 ❹Ⓚ", path: "live/4476647188407159/4476647188407159/432892.m3u8" },
    { id: "14", title: "|CAN|FR beIN SPORTS MAX 4 ⒻⒽⒹ", path: "live/4476647188407159/4476647188407159/432891.m3u8" },
    { id: "15", title: "|CAN|FR beIN SPORTS MAX 4 ⒽⒹ", path: "live/4476647188407159/4476647188407159/432890.m3u8" },
    { id: "16", title: "|CAN|FR beIN SPORTS MAX 4 ⓈⒹ", path: "live/4476647188407159/4476647188407159/432889.m3u8" },
    { id: "17", title: "|CAN|DZ PROGRAMME NATIONAL ALGÉRIE ⒽⒹ", path: "live/4476647188407159/4476647188407159/432888.m3u8" },
    { id: "18", title: "|CAN|FR CANAL+ CAN ⒽⒹ", path: "live/4476647188407159/4476647188407159/432884.m3u8" },
    { id: "19", title: "|CAN|FR beIN SPORTS 1 ⒽⒹ", path: "live/4476647188407159/4476647188407159/432883.m3u8" },
    { id: "20", title: "|CAN|FR beIN SPORTS 2 ⒽⒹ", path: "live/4476647188407159/4476647188407159/432882.m3u8" },
    { id: "21", title: "|CAN|ES LALIGA+ TV ⒽⒹ", path: "live/4476647188407159/4476647188407159/432881.m3u8" },
    { id: "22", title: "|DZ| EL BILAD TV", path: "live/4476647188407159/4476647188407159/351100.m3u8" },
    { id: "23", title: "|DZ| ALGERIE 6", path: "live/4476647188407159/4476647188407159/327314.m3u8" },
    { id: "24", title: "|DZ| ALGERIE 8", path: "live/4476647188407159/4476647188407159/295979.m3u8" },
    { id: "25", title: "|DZ| AL 24 NEWS", path: "live/4476647188407159/4476647188407159/295221.m3u8" },
    { id: "26", title: "|DZ| ALGERIE 7", path: "live/4476647188407159/4476647188407159/152921.m3u8" },
    { id: "27", title: "|DZ| CANAL ALGERIE", path: "live/4476647188407159/4476647188407159/1687.m3u8" },
    { id: "28", title: "|DZ| A3 ALGERIE", path: "live/4476647188407159/4476647188407159/1675.m3u8" },
    { id: "29", title: "Rakuten Top Movies UK", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8" },
    { id: "30", title: "Rakuten Action Movies FI", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/master.m3u8" },
    { id: "31", title: "Rakuten Action Movies DE", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8" },
    { id: "32", title: "Rakuten Action Movies IT", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6067/master.m3u8" },
    { id: "33", title: "Rakuten Action Movies ES", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6069/master.m3u8" },
    { id: "34", title: "Rakuten Action Movies UK", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8" },
    { id: "35", title: "Rakuten Comedy Movies FI", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6191/master.m3u8" },
    { id: "36", title: "Rakuten Comedy Movies DE", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6182/master.m3u8" },
    { id: "37", title: "Rakuten Comedy Movies IT", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6184/master.m3u8" },
    { id: "38", title: "Rakuten Comedy Movies ES", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6180/master.m3u8" },
    { id: "39", title: "Rakuten Comedy Movies UK", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6181/master.m3u8" },
    { id: "40", title: "Rakuten Drama Movies FI", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6102/master.m3u8" },
    { id: "41", title: "Rakuten Drama Movies DE", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6096/master.m3u8" },
    { id: "42", title: "Rakuten Drama Movies IT", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8" },
    { id: "43", title: "Rakuten Drama Movies ES", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6092/master.m3u8" },
    { id: "44", title: "Rakuten Drama Movies UK", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6093/master.m3u8" },
    { id: "45", title: "Rakuten Nordic Films", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6303/master.m3u8" },
    { id: "46", title: "Rakuten Top Movies FI", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6057/master.m3u8" },
    { id: "47", title: "Rakuten Top Movies DE", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5985/master.m3u8" },
    { id: "48", title: "Rakuten Top Movies IT", path: "v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8" }
  ];

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  function playChannel(ch) {
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    // توجيه الطلب عبر البروكسي الخاص بك 
    const streamUrl = `/api/streams/${ch.path}`;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.play().catch(() => {});
    } else if (window.Hls && window.Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new window.Hls({ maxBufferLength: 30 });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;
      video.play().catch(() => {});
    }
  }

  return (
    <div className="app-container">
      <Head>
        <title>𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄 | Premium Edition</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root { --accent: #00e0d6; --bg: #050505; --card-bg: rgba(255,255,255,0.03); }
          body { background: var(--bg); color: white; font-family: 'Cairo', sans-serif; margin: 0; padding: 0; }
          .app-container { min-height: 100vh; display: flex; flex-direction: column; }
          
          header { 
            padding: 15px 30px; border-bottom: 1px solid rgba(255,255,255,0.05); 
            display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
            position: sticky; top: 0; z-index: 100;
          }
          .logo { font-weight: 900; font-size: 22px; color: var(--accent); text-shadow: 0 0 10px rgba(0,224,214,0.3); }
          .status { font-size: 10px; opacity: 0.5; border: 1px solid rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 20px; }

          main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 20px; gap: 30px; }
          
          .player-section { width: 100%; max-width: 960px; position: relative; }
          .video-wrapper { 
            width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 15px; overflow: hidden; 
            border: 1px solid #1a1a1a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
          }
          video { width: 100%; height: 100%; object-fit: contain; }

          .grid-section { width: 100%; max-width: 1000px; }
          .grid-title { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; font-weight: bold; }
          .channels-grid { 
            display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); 
            gap: 12px; width: 100%; 
          }
          .channel-card { 
            background: var(--card-bg); border: 1px solid rgba(255,255,255,0.05); 
            padding: 15px; border-radius: 12px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center; font-size: 13px; font-weight: 700; color: #888; display: flex; align-items: center; justify-content: center;
          }
          .channel-card:hover { border-color: var(--accent); color: white; background: rgba(0, 224, 214, 0.05); transform: translateY(-3px); }
          .channel-card.active { background: var(--accent); color: #000; border-color: var(--accent); box-shadow: 0 10px 20px -5px rgba(0, 224, 214, 0.4); transform: scale(1.02); }

          footer { padding: 40px; text-align: center; font-size: 11px; opacity: 0.3; letter-spacing: 1px; }
          
          @media (max-width: 600px) {
            .channels-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
            .logo { font-size: 18px; }
          }
        `}</style>
      </Head>

      <header>
        <div className="logo">𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄</div>
        <div className="status">HTTPS PROXY ACTIVE</div>
      </header>

      <main>
        <div className="player-section">
          <div className="video-wrapper">
            <video ref={videoRef} controls playsInline autoPlay />
          </div>
        </div>

        <div className="grid-section">
          <div className="grid-title">Premium Channels List</div>
          <div className="channels-grid">
            {channels.map((ch) => (
              <div 
                key={ch.id} 
                className={`channel-card ${active === ch.id ? 'active' : ''}`}
                onClick={() => playChannel(ch)}
              >
                {ch.title}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        DESIGNED BY MUSTAPHA — ALL RIGHTS RESERVED 2026
      </footer>
    </div>
  );
}
