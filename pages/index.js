import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  // القنوات كما هي في كودك تماماً دون حذف أي حرف
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
    { id: "29", title: "Rakuten_Top_Movies_UK_(1080p)", url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8" },
    { id: "30", title: "Rakuten_TV_Action_Movies_Finland_(1080p)", url: "https://bca5a421a70c46ad911efd0a4767c4bf.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/master.m3u8" },
    { id: "31", title: "Rakuten_TV_Action_Movies_Germany_(1080p)", url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8" },
    { id: "32", title: "Rakuten_TV_Action_Movies_Italy_(1080p)", url: "https://87f2e2e5e7624e3bad85da1ca2ed31a7.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6067/master.m3u8" },
    { id: "33", title: "Rakuten_TV_Action_Movies_Spain_(1080p)", url: "https://a9c57ec7ec5e4b7daeacc6316a0bb404.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6069/master.m3u8" },
    { id: "34", title: "Rakuten_TV_Action_Movies_UK_(1080p)", url: "https://54045f0c40fd442c8b06df076aaf1e85.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8" },
    { id: "35", title: "Rakuten_TV_Comedy_Movies_Finland_(1080p)", url: "https://a300af98e00746e2acf2346f43e47bd1.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6191/master.m3u8" },
    { id: "36", title: "Rakuten_TV_Comedy_Movies_Germany_(1080p)", url: "https://ecac08c9e2214375b907d6825aaf9a01.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6182/master.m3u8" },
    { id: "37", title: "Rakuten_TV_Comedy_Movies_Italy_(1080p)", url: "https://b8bc6c4b9be64bd6aeb3b92aa8521ed4.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6184/master.m3u8" },
    { id: "38", title: "Rakuten_TV_Comedy_Movies_Spain_(1080p)", url: "https://71db867f03ce4d71a29e92155f07ab87.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6180/master.m3u8" },
    { id: "39", title: "Rakuten_TV_Comedy_Movies_UK_(1080p)", url: "https://9be783d652cd4b099cf63e1dc134c4a3.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6181/master.m3u8" },
    { id: "40", title: "Rakuten_TV_Drama_Movies_Finland_(1080p)", url: "https://d7e8ee3c924d4305a0c1840fe94c5d36.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6102/master.m3u8" },
    { id: "41", title: "Rakuten_TV_Drama_Movies_Germany_(1080p)", url: "https://968754c2483045c1a9a7f677caec35b6.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6096/master.m3u8" },
    { id: "42", title: "Rakuten_TV_Drama_Movies_Italy_(1080p)", url: "https://f84e0b1628464fab846160df957f269e.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8" },
    { id: "43", title: "Rakuten_TV_Drama_Movies_Spain_(1080p)", url: "https://a7089c89d85f453d850c4a1518b43076.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6092/master.m3u8" },
    { id: "44", title: "Rakuten_TV_Drama_Movies_UK_(1080p)", url: "https://fee09fd665814f51b939b6d106cf5f66.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6093/master.m3u8" },
    { id: "45", title: "Rakuten_TV_Nordic_Films_(1080p)", url: "https://4aa9ef08b70d4b0c8f3519c5950b1930.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6303/master.m3u8" },
    { id: "46", title: "Rakuten_TV_Top_Movies_Finland_(1080p)", url: "https://1d1b0d4cb6ae4c31985d13221795695b.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6057/master.m3u8" },
    { id: "47", title: "Rakuten_TV_Top_Movies_Germany_(1080p)", url: "https://cbb622b29f5d43b598991f3fa19de291.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5985/master.m3u8" },
    { id: "48", title: "Rakuten_TV_Top_Movies_Italy_(1080p)", url: "https://54045f0c40fd442c8b06df076aaf1e85.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8" }
  ];

  // --- آلية التشغيل الأصلية (لا تلمس) ---
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

    if (hlsRef.current) { try { hlsRef.current.destroy(); } catch {} hlsRef.current = null; }
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
        <title>𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄 | Premium Interface</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root { --accent: #00f2ea; --bg: #050505; --glass: rgba(255,255,255,0.03); }
          body { margin:0; font-family: 'Cairo', sans-serif; background: var(--bg); color:#fff; overflow-x: hidden; }
          
          .header { padding: 25px; display: flex; align-items: center; justify-content: center; gap: 15px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.1); }
          .logo-box { width: 50px; height: 50px; background: linear-gradient(135deg, var(--accent), #0077ff); border-radius: 12px; display: grid; place-items: center; box-shadow: 0 0 20px rgba(0,242,234,0.3); animation: float 3s infinite ease-in-out; }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          .logo-text { font-weight: 900; font-size: 24px; color: #fff; text-shadow: 0 0 10px var(--accent); }

          .container { max-width: 1200px; margin: 0 auto; padding: 30px 15px; display: flex; flex-direction: column; align-items: center; }

          /* Glowy Video Frame */
          .player-card { width: 100%; max-width: 900px; background: #000; border-radius: 24px; padding: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.8); position: relative; }
          .screen { aspect-ratio: 16/9; border-radius: 15px; overflow: hidden; background: #000; }

          /* Glossy Channel Buttons */
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; width: 100%; margin-top: 40px; }
          .btn { background: var(--glass); border: 1px solid rgba(255,255,255,0.1); padding: 18px 10px; border-radius: 16px; cursor: pointer; transition: 0.3s; color: #aaa; font-weight: 700; font-size: 13px; position: relative; overflow: hidden; }
          
          /* اللمعة الزجاجية */
          .btn::after { content: ''; position: absolute; top: -50%; left: -100%; width: 50%; height: 200%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); transform: rotate(30deg); transition: 0.5s; }
          .btn:hover { border-color: var(--accent); color: #fff; transform: translateY(-3px); background: rgba(0, 242, 234, 0.05); }
          .btn:hover::after { left: 150%; }
          
          .btn.active { background: var(--accent); color: #000; border: none; box-shadow: 0 0 25px var(--accent); }

          .controls { display: flex; gap: 12px; margin: 25px 0; }
          .action { padding: 10px 25px; border-radius: 30px; border: 1px solid #333; background: #111; color: #fff; cursor: pointer; font-weight: bold; transition: 0.2s; }
          .action:hover { background: #fff; color: #000; }
          
          .footer { margin-top: 50px; opacity: 0.3; font-size: 11px; letter-spacing: 2px; }
        `}</style>
      </Head>

      <div className="header">
        <div className="logo-box">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="#000"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7l7 4z"/></svg>
        </div>
        <div className="logo-text">𝐌𝐈𝐒𝐓𝐄𝐑-𝐀𝐈-𝐋𝐈𝐕𝐄</div>
      </div>

      <div className="container">
        <div className="player-card">
          <div className="screen">
            <video ref={videoRef} controls playsInline style={{ width:"100%", height:"100%" }} />
            {!active && (
              <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.85)"}}>
                <button onClick={() => playChannel(channels[18])} className="action" style={{background: 'var(--accent)', color: '#000', border:'none', scale:'1.2'}}>تشغيل beIN SPORTS 1</button>
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          <button className="action" onClick={() => { if(active) playChannel(channels.find(c => c.id === active)) }}>🔄 تحديث</button>
          <button className="action" onClick={toggleMute}>{muted ? "🔈 تشغيل الصوت" : "🔇 كتم الصوت"}</button>
          <a href="https://x.com/neurosisnet" target="_blank" rel="noreferrer" className="action" style={{textDecoration:'none'}}>حساب X</a>
        </div>

        <div className="grid">
          {channels.map((ch) => (
            <button
              key={ch.id}
              className={`btn ${active === ch.id ? "active" : ""}`}
              onClick={() => playChannel(ch)}
            >
              {ch.title}
            </button>
          ))}
        </div>

        {error && <div style={{color:"#ff4b4b", marginTop:20, fontWeight:"bold"}}>{error}</div>}
        
        <div className="footer">DESIGN BY MUSTAPHA — 2026 PREMIUM</div>
      </div>
    </>
  );
}
