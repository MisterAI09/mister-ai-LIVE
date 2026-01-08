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
  const [loading, setLoading] = useState(false);

  // جميع القنوات - النظام الأصلي
  const channels = [
    { id: "1", title: "beIN SPORTS Max 1 4K", category: "sports", quality: "4K", lang: "ar" },
    { id: "2", title: "beIN SPORTS Max 1 FHD", category: "sports", quality: "FHD", lang: "ar" },
    { id: "3", title: "beIN SPORTS Max 1 HD", category: "sports", quality: "HD", lang: "ar" },
    { id: "4", title: "beIN SPORTS Max 1 SD", category: "sports", quality: "SD", lang: "ar" },
    { id: "5", title: "beIN SPORTS Max 2 4K", category: "sports", quality: "4K", lang: "ar" },
    { id: "6", title: "beIN SPORTS Max 2 FHD", category: "sports", quality: "FHD", lang: "ar" },
    { id: "7", title: "beIN SPORTS Max 2 HD", category: "sports", quality: "HD", lang: "ar" },
    { id: "8", title: "beIN SPORTS Max 2 SD", category: "sports", quality: "SD", lang: "ar" },
    { id: "9", title: "beIN SPORTS Max 3 4K (EN)", category: "sports", quality: "4K", lang: "en" },
    { id: "10", title: "beIN SPORTS Max 3 FHD (EN)", category: "sports", quality: "FHD", lang: "en" },
    { id: "11", title: "beIN SPORTS Max 3 HD (EN)", category: "sports", quality: "HD", lang: "en" },
    { id: "12", title: "beIN SPORTS Max 4 4K (FR)", category: "sports", quality: "4K", lang: "fr" },
    { id: "13", title: "beIN SPORTS Max 4 FHD (FR)", category: "sports", quality: "FHD", lang: "fr" },
    { id: "14", title: "PROGRAMME NATIONAL ALGÉRIE", category: "national", quality: "HD", lang: "ar" },
    { id: "15", title: "EL BILAD TV", category: "national", quality: "HD", lang: "ar" },
    { id: "16", title: "ALGERIE 6", category: "national", quality: "HD", lang: "ar" },
    { id: "17", title: "ALGERIE 8", category: "national", quality: "HD", lang: "ar" },
    { id: "18", title: "AL 24 NEWS", category: "news", quality: "HD", lang: "ar" },
    { id: "19", title: "ALGERIE 7", category: "national", quality: "HD", lang: "ar" },
    { id: "20", title: "CANAL ALGERIE", category: "national", quality: "HD", lang: "ar" },
    { id: "21", title: "A3 ALGERIE", category: "national", quality: "HD", lang: "ar" },
    { id: "22", title: "beIN SPORTS 1 (CA)", category: "sports", quality: "HD", lang: "fr" },
    { id: "23", title: "beIN SPORTS 2 (CA)", category: "sports", quality: "HD", lang: "fr" },
    { id: "24", title: "LALIGA+ TV (CA)", category: "sports", quality: "HD", lang: "es" },
    { id: "25", title: "CANAL+ CAN (CA)", category: "entertainment", quality: "HD", lang: "fr" },
    { id: "26", title: "Rakuten Top Movies UK", category: "movies", quality: "FHD", lang: "en" },
    { id: "27", title: "Rakuten Action Movies UK", category: "movies", quality: "FHD", lang: "en" },
    { id: "28", title: "Rakuten Comedy Movies UK", category: "movies", quality: "FHD", lang: "en" },
    { id: "29", title: "Rakuten Drama Movies UK", category: "movies", quality: "FHD", lang: "en" },
    { id: "30", title: "📺 قناة اختبار MP4", category: "test", quality: "HD", lang: "en" },
    { id: "31", title: "📺 اختبار 2 MP4", category: "test", quality: "HD", lang: "en" },
  ];

  // دالة للحصول على رابط القناة (بدون إظهار الأسرار)
  const getChannelUrl = (channelId) => {
    // استخدم المسار الثابت الذي يعمل مع البروكسي الموجود
    return `/api/streams/beinsport${channelId}.m3u8`;
  };

  // التصنيفات
  const categories = [
    { id: "all", name: "جميع القنوات" },
    { id: "sports", name: "رياضة" },
    { id: "movies", name: "أفلام" },
    { id: "national", name: "وطنية" },
    { id: "news", name: "أخبار" },
    { id: "entertainment", name: "ترفيه" },
    { id: "test", name: "اختبار" },
  ];

  // تصفية القنوات
  const filteredChannels = channels.filter(ch => {
    const matchesSearch = search === "" || 
      ch.title.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === "all" || ch.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // load hls.js dynamically
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    s.onload = () => console.log("hls.js loaded");
    s.onerror = () => console.warn("hls.js failed to load");
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // دالة تشغيل القناة - النظام الأصلي الذي كان يعمل
  async function playChannel(ch) {
    setLoading(true);
    setError("");
    setActive(ch.id);
    
    const video = videoRef.current;
    if (!video) {
      setError("عنصر الفيديو غير موجود");
      setLoading(false);
      return;
    }

    try {
      // إيقاف الفيديو الحالي
      video.pause();
      
      // تنظيف HLS القديم
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying HLS:", e);
        }
        hlsRef.current = null;
      }

      // الحصول على رابط القناة
      let streamUrl;
      
      // إذا كانت قناة اختبار، استخدم MP4 مباشر
      if (ch.id === "30") {
        streamUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      } else if (ch.id === "31") {
        streamUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
      } else {
        // لباقي القنوات، استخدم النظام الأصلي
        streamUrl = getChannelUrl(ch.id);
      }

      console.log(`Playing: ${ch.title} - URL: ${streamUrl}`);

      // إعداد الفيديو
      video.src = streamUrl;
      video.muted = muted;
      
      // إذا كان MP4، شغله مباشرة
      if (streamUrl.includes('.mp4')) {
        try {
          await video.play();
          setLoading(false);
        } catch (e) {
          console.error("MP4 play error:", e);
          setError("خطأ في تشغيل الفيديو. حاول تفعيل الصوت.");
          setLoading(false);
        }
        return;
      }

      // إذا كان m3u8، استخدم HLS.js أو التشغيل الأصلي
      // Safari يدعم HLS أصلياً
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        try {
          await video.play();
          setLoading(false);
        } catch (e) {
          console.error("Native HLS play error:", e);
          setError("خطأ في تشغيل البث. حاول قناة أخرى.");
          setLoading(false);
        }
      } 
      // للمتصفحات الأخرى، استخدم HLS.js
      else if (window.Hls) {
        if (window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            liveSyncDurationCount: 3,
          });
          
          hlsRef.current = hls;
          
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          
          hls.on(window.Hls.Events.MANIFEST_PARSED, async () => {
            try {
              await video.play();
              setLoading(false);
            } catch (e) {
              console.error("HLS.js play error:", e);
              setError("تعذر تشغيل الفيديو. حاول تفعيل الصوت.");
              setLoading(false);
            }
          });
          
          hls.on(window.Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              setError("خطأ في البث. حاول قناة أخرى.");
              setLoading(false);
            }
          });
        } else {
          setError("المتصفح لا يدعم تشغيل HLS.");
          setLoading(false);
        }
      } else {
        setError("جاري تحميل مشغل الفيديو... انتظر قليلاً.");
        setTimeout(() => setLoading(false), 2000);
      }
    } catch (error) {
      console.error("Error playing channel:", error);
      setError("خطأ غير متوقع. حاول مرة أخرى.");
      setLoading(false);
    }
  }

  function overlayPlay() {
    const ch = active ? channels.find(c => c.id === active) : channels[0];
    if (ch) playChannel(ch);
  }

  function toggleMute() {
    const v = videoRef.current; 
    if (!v) return; 
    v.muted = !v.muted; 
    setMuted(v.muted);
  }

  // إعدادات الفيديو
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.crossOrigin = "anonymous";
      video.preload = "auto";
    }
  }, []);

  // cleanup hls on unmount
  useEffect(() => {
    return () => {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
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
          
          .main-container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 30px;
          }
          
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
            padding-top: 56.25%;
            background: #000;
          }
          
          .video-player video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
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
          
          /* Loading overlay */
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
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
          
          /* Error message */
          .error-message {
            background: rgba(255, 42, 109, 0.2);
            border: 1px solid var(--accent);
            color: #ffb8d0;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
          }
          
          /* Success message */
          .success-message {
            background: rgba(0, 224, 214, 0.2);
            border: 1px solid var(--primary);
            color: #b8fff8;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
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
              {loading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>
              )}
              <video 
                ref={videoRef} 
                controls 
                playsInline 
                crossOrigin="anonymous"
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
                    <span>{channels.find(c => c.id === active)?.lang?.toUpperCase()}</span>
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
                    <span className="channel-language">{ch.lang?.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="success-message">
          💡 <strong>نصيحة:</strong> ابدأ بقنوات الاختبار (📺) للتأكد من عمل المشغل، ثم جرب القنوات الأخرى
        </div>
      </main>

      <footer className="footer">
        <div className="footer-logo">MISTER-AI-LIVE</div>
        <div>© 2026 MISTERAI LIVE — جميع الحقوق محفوظة — MisterAI_Security</div>
      </footer>
    </>
  );
}
