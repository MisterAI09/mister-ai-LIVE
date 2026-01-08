import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // جميع القنوات مع التصنيفات
  const channels = [
    // قنوات beIN SPORTS Max (العربية)
    { id: "1", title: "beIN SPORTS Max 1 4K", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432904.m3u8", category: "sports", quality: "4K", lang: "ar", country: "ca" },
    { id: "2", title: "beIN SPORTS Max 1 FHD", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432903.m3u8", category: "sports", quality: "FHD", lang: "ar", country: "ca" },
    { id: "3", title: "beIN SPORTS Max 1 HD", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432902.m3u8", category: "sports", quality: "HD", lang: "ar", country: "ca" },
    { id: "4", title: "beIN SPORTS Max 1 SD", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432901.m3u8", category: "sports", quality: "SD", lang: "ar", country: "ca" },
    { id: "5", title: "beIN SPORTS Max 2 4K", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432900.m3u8", category: "sports", quality: "4K", lang: "ar", country: "ca" },
    { id: "6", title: "beIN SPORTS Max 2 FHD", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432899.m3u8", category: "sports", quality: "FHD", lang: "ar", country: "ca" },
    { id: "7", title: "beIN SPORTS Max 2 HD", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432898.m3u8", category: "sports", quality: "HD", lang: "ar", country: "ca" },
    { id: "8", title: "beIN SPORTS Max 2 SD", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432897.m3u8", category: "sports", quality: "SD", lang: "ar", country: "ca" },
    
    // قنوات beIN SPORTS Max (إنجليزية وفرنسية)
    { id: "9", title: "beIN SPORTS Max 3 4K (EN)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432896.m3u8", category: "sports", quality: "4K", lang: "en", country: "ca" },
    { id: "10", title: "beIN SPORTS Max 3 FHD (EN)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432895.m3u8", category: "sports", quality: "FHD", lang: "en", country: "ca" },
    { id: "11", title: "beIN SPORTS Max 3 HD (EN)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432894.m3u8", category: "sports", quality: "HD", lang: "en", country: "ca" },
    { id: "12", title: "beIN SPORTS Max 4 4K (FR)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432892.m3u8", category: "sports", quality: "4K", lang: "fr", country: "ca" },
    { id: "13", title: "beIN SPORTS Max 4 FHD (FR)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432891.m3u8", category: "sports", quality: "FHD", lang: "fr", country: "ca" },
    
    // قنوات الجزائرية
    { id: "14", title: "PROGRAMME NATIONAL ALGÉRIE", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432888.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    { id: "15", title: "EL BILAD TV", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/351100.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    { id: "16", title: "ALGERIE 6", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/327314.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    { id: "17", title: "ALGERIE 8", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/295979.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    { id: "18", title: "AL 24 NEWS", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/295221.m3u8", category: "news", quality: "HD", lang: "ar", country: "dz" },
    { id: "19", title: "ALGERIE 7", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/152921.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    { id: "20", title: "CANAL ALGERIE", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1687.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    { id: "21", title: "A3 ALGERIE", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1675.m3u8", category: "national", quality: "HD", lang: "ar", country: "dz" },
    
    // قنوات beIN SPORTS كندية
    { id: "22", title: "beIN SPORTS 1 (CA)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432883.m3u8", category: "sports", quality: "HD", lang: "fr", country: "ca" },
    { id: "23", title: "beIN SPORTS 2 (CA)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432882.m3u8", category: "sports", quality: "HD", lang: "fr", country: "ca" },
    { id: "24", title: "LALIGA+ TV (CA)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432881.m3u8", category: "sports", quality: "HD", lang: "es", country: "ca" },
    { id: "25", title: "CANAL+ CAN (CA)", url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432884.m3u8", category: "entertainment", quality: "HD", lang: "fr", country: "ca" },
    
    // قنوات Rakuten Movies
    { id: "26", title: "Rakuten Top Movies UK", url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8", category: "movies", quality: "FHD", lang: "en", country: "uk" },
    { id: "27", title: "Rakuten Action Movies UK", url: "https://54045f0c40fd442c8b06df076aaf1e85.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8", category: "movies", quality: "FHD", lang: "en", country: "uk" },
    { id: "28", title: "Rakuten Comedy Movies UK", url: "https://9be783d652cd4b099cf63e1dc134c4a3.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6181/master.m3u8", category: "movies", quality: "FHD", lang: "en", country: "uk" },
    { id: "29", title: "Rakuten Drama Movies UK", url: "https://fee09fd665814f51b939b6d106cf5f66.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6093/master.m3u8", category: "movies", quality: "FHD", lang: "en", country: "uk" },
    { id: "30", title: "Rakuten Top Movies Germany", url: "https://cbb622b29f5d43b598991f3fa19de291.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5985/master.m3u8", category: "movies", quality: "FHD", lang: "de", country: "de" },
    { id: "31", title: "Rakuten Action Movies Germany", url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8", category: "movies", quality: "FHD", lang: "de", country: "de" },
    { id: "32", title: "Rakuten Top Movies Italy", url: "https://f84e0b1628464fab846160df957f269e.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8", category: "movies", quality: "FHD", lang: "it", country: "it" },
    { id: "33", title: "Rakuten Action Movies Italy", url: "https://87f2e2e5e7624e3bad85da1ca2ed31a7.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6067/master.m3u8", category: "movies", quality: "FHD", lang: "it", country: "it" },
    { id: "34", title: "Rakuten Top Movies Spain", url: "https://a7089c89d85f453d850c4a1518b43076.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6092/master.m3u8", category: "movies", quality: "FHD", lang: "es", country: "es" },
    { id: "35", title: "Rakuten Action Movies Spain", url: "https://a9c57ec7ec5e4b7daeacc6316a0bb404.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6069/master.m3u8", category: "movies", quality: "FHD", lang: "es", country: "es" },
    { id: "36", title: "Rakuten Top Movies Finland", url: "https://1d1b0d4cb6ae4c31985d13221795695b.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6057/master.m3u8", category: "movies", quality: "FHD", lang: "fi", country: "fi" },
    { id: "37", title: "Rakuten Action Movies Finland", url: "https://bca5a421a70c46ad911efd0a4767c4bf.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/master.m3u8", category: "movies", quality: "FHD", lang: "fi", country: "fi" },
    { id: "38", title: "Rakuten Comedy Movies Finland", url: "https://a300af98e00746e2acf2346f43e47bd1.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6191/master.m3u8", category: "movies", quality: "FHD", lang: "fi", country: "fi" },
    { id: "39", title: "Rakuten Nordic Films", url: "https://4aa9ef08b70d4b0c8f3519c5950b1930.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6303/master.m3u8", category: "movies", quality: "FHD", lang: "no", country: "no" },
  ];

  // التصنيفات
  const categories = [
    { id: "all", name: "جميع القنوات" },
    { id: "sports", name: "رياضة" },
    { id: "movies", name: "أفلام" },
    { id: "national", name: "وطنية" },
    { id: "news", name: "أخبار" },
    { id: "entertainment", name: "ترفيه" },
  ];

  // تصفية القنوات
  const filteredChannels = channels.filter(ch => {
    const matchesSearch = search === "" || 
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      ch.lang.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === "all" || ch.category === category;
    
    return matchesSearch && matchesCategory;
  });

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

  // play logic
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
        <title>MISTER-AI-LIVE — البث المباشر المتطور</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg: linear-gradient(135deg, #0c0c2e 0%, #1a1a3e 25%, #2d0c2e 50%, #1a1a3e 75%, #0c0c2e 100%);
            --primary: #00e0d6;
            --secondary: #00bfff;
            --accent: #ff2a6d;
            --card-bg: rgba(15, 20, 40, 0.85);
            --glass: rgba(255, 255, 255, 0.08);
            --glow: 0 0 30px rgba(0, 224, 214, 0.3);
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body, #__next {
            min-height: 100vh;
            font-family: 'Cairo', sans-serif;
          }
          
          body {
            background: var(--bg);
            background-size: 400% 400%;
            animation: gradientBG 20s ease infinite;
            color: #ffffff;
            overflow-x: hidden;
            position: relative;
          }
          
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Animated background elements */
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 224, 214, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 42, 109, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(0, 191, 255, 0.1) 0%, transparent 50%);
            z-index: -2;
            animation: pulse 10s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          
          /* Floating particles */
          .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
          }
          
          .particle {
            position: absolute;
            background: rgba(0, 224, 214, 0.3);
            border-radius: 50%;
            animation: float 20s infinite linear;
          }
          
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-100vh) rotate(360deg); }
          }
          
          /* Header with animated logo */
          .header {
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(15, 20, 40, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 224, 214, 0.2);
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          
          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .animated-logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: rotate 10s linear infinite;
            box-shadow: var(--glow);
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .logo-text {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(45deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(0, 224, 214, 0.3);
          }
          
          .logo-subtext {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-top: -5px;
          }
          
          .live-badge {
            background: linear-gradient(45deg, #ff2a6d, #ff6b9d);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 700;
            animation: pulse 2s infinite;
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.5);
          }
          
          /* Main container */
          .main-container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 30px;
          }
          
          /* Video player section */
          .video-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          @media (max-width: 1200px) {
            .video-section {
              grid-template-columns: 1fr;
            }
          }
          
          .video-player-container {
            background: var(--card-bg);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(0, 224, 214, 0.2);
            box-shadow: var(--glow);
          }
          
          .video-player {
            position: relative;
            width: 100%;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
            background: #000;
          }
          
          .video-player video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
            cursor: pointer;
          }
          
          .video-player:hover .video-overlay {
            opacity: 1;
          }
          
          .play-btn {
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid var(--primary);
            transition: transform 0.3s;
          }
          
          .play-btn:hover {
            transform: scale(1.1);
            background: rgba(0, 224, 214, 0.2);
          }
          
          .play-btn svg {
            width: 30px;
            height: 30px;
            fill: var(--primary);
          }
          
          .video-info {
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
          }
          
          .channel-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--primary);
          }
          
          .channel-meta {
            display: flex;
            gap: 15px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
          }
          
          .quality-badge {
            background: var(--accent);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
          }
          
          /* Controls */
          .controls {
            display: flex;
            gap: 10px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .control-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            background: var(--glass);
            color: white;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .control-btn:hover {
            background: rgba(0, 224, 214, 0.3);
            transform: translateY(-2px);
          }
          
          .control-btn.active {
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            box-shadow: var(--glow);
          }
          
          /* Channel list */
          .channels-container {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid rgba(0, 224, 214, 0.2);
            box-shadow: var(--glow);
          }
          
          .channels-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .channels-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--primary);
          }
          
          .channels-count {
            background: var(--accent);
            color: white;
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 14px;
          }
          
          .search-box {
            position: relative;
            margin-bottom: 20px;
          }
          
          .search-input {
            width: 100%;
            padding: 15px 20px 15px 50px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(0, 224, 214, 0.3);
            border-radius: 15px;
            color: white;
            font-family: 'Cairo', sans-serif;
            font-size: 16px;
            transition: all 0.3s;
          }
          
          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 20px rgba(0, 224, 214, 0.3);
            background: rgba(255, 255, 255, 0.15);
          }
          
          .search-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--primary);
          }
          
          /* Categories */
          .categories {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 15px;
            margin-bottom: 20px;
            scrollbar-width: thin;
          }
          
          .category-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
          }
          
          .category-btn:hover {
            background: rgba(0, 224, 214, 0.3);
          }
          
          .category-btn.active {
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            box-shadow: var(--glow);
          }
          
          /* Channels grid */
          .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 10px;
          }
          
          .channel-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s;
            border: 1px solid transparent;
            position: relative;
            overflow: hidden;
          }
          
          .channel-card:hover {
            background: rgba(0, 224, 214, 0.1);
            transform: translateY(-5px);
            border-color: var(--primary);
            box-shadow: var(--glow);
          }
          
          .channel-card.active {
            background: linear-gradient(135deg, rgba(0, 224, 214, 0.2), rgba(0, 191, 255, 0.2));
            border-color: var(--primary);
            box-shadow: var(--glow);
          }
          
          .channel-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
          }
          
          .channel-card:hover::before {
            left: 100%;
          }
          
          .channel-number {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--accent);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
          }
          
          .channel-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: white;
          }
          
          .channel-details {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
          }
          
          .channel-quality {
            background: rgba(255, 42, 109, 0.2);
            color: #ff6b9d;
            padding: 2px 8px;
            border-radius: 10px;
          }
          
          .channel-language {
            background: rgba(0, 224, 214, 0.2);
            color: var(--primary);
            padding: 2px 8px;
            border-radius: 10px;
          }
          
          /* Footer */
          .footer {
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .footer-logo {
            color: var(--primary);
            font-weight: 800;
            margin-bottom: 10px;
          }
          
          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, var(--secondary), var(--primary));
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .header {
              padding: 15px 20px;
              flex-direction: column;
              gap: 15px;
            }
            
            .main-container {
              padding: 15px;
            }
            
            .video-section {
              gap: 20px;
            }
            
            .channels-grid {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
            
            .controls {
              flex-wrap: wrap;
            }
            
            .categories {
              flex-wrap: wrap;
            }
          }
          
          @media (max-width: 480px) {
            .channels-grid {
              grid-template-columns: 1fr;
            }
            
            .logo-text {
              font-size: 18px;
            }
            
            .animated-logo {
              width: 45px;
              height: 45px;
            }
          }
          
          /* Error message */
          .error-message {
            background: rgba(255, 42, 109, 0.2);
            border: 1px solid var(--accent);
            color: #ffb8d0;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            animation: shake 0.5s ease-in-out;
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          
          /* Loading animation */
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Head>

      {/* Animated particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="animated-logo">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#001217"/>
              <path d="M2 17L12 22L22 17" stroke="#001217" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#001217" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">MISTER-AI-LIVE</div>
            <div className="logo-subtext">البث المباشر المتطور</div>
          </div>
        </div>
        <div className="live-badge">مباشر LIVE</div>
      </header>

      {/* Main content */}
      <main className="main-container">
        <div className="video-section">
          <div className="video-player-container">
            <div className="video-player">
              <video 
                ref={videoRef} 
                controls 
                playsInline 
                style={{ width: "100%", height: "100%", background: "#000" }}
              />
              <div className="video-overlay" onClick={overlayPlay}>
                <div className="play-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="video-info">
              <div className="channel-title">
                {active ? channels.find(c => c.id === active)?.title : "اختر قناة للبدأ"}
              </div>
              <div className="channel-meta">
                {active && (
                  <>
                    <span className="quality-badge">
                      {channels.find(c => c.id === active)?.quality}
                    </span>
                    <span>•</span>
                    <span>{channels.find(c => c.id === active)?.lang.toUpperCase()}</span>
                    <span>•</span>
                    <span>{channels.find(c => c.id === active)?.country.toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="controls">
              <button className="control-btn" onClick={() => {
                const ch = active ? channels.find(c => c.id === active) : channels[0];
                if (ch) playChannel(ch);
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                إعادة تشغيل
              </button>
              
              <button className="control-btn" onClick={toggleMute}>
                {muted ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                    إلغاء الكتم
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    كتم الصوت
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="channels-container">
            <div className="channels-header">
              <div className="channels-title">القنوات المتاحة</div>
              <div className="channels-count">{filteredChannels.length} قناة</div>
            </div>

            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="ابحث عن قناة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
            </div>

            <div className="categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="channels-grid">
              {filteredChannels.map((ch) => (
                <div
                  key={ch.id}
                  className={`channel-card ${active === ch.id ? 'active' : ''}`}
                  onClick={() => playChannel(ch)}
                >
                  <div className="channel-number">{ch.id}</div>
                  <div className="channel-name">{ch.title}</div>
                  <div className="channel-details">
                    <span className="channel-quality">{ch.quality}</span>
                    <span className="channel-language">{ch.lang.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-logo">MISTER-AI-LIVE</div>
        <div>© 2026 MISTERAI LIVE — جميع الحقوق محفوظة — MisterAI_Security</div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
          {filteredChannels.length} قناة نشطة • آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
        </div>
      </footer>
    </>
  );
}
