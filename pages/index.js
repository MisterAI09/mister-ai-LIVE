import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);

  // 🔥 قنوات خارجية تفتح في صفحة جديدة (بدون بروكسي)
  const externalChannels = [
    // قنوات رياضية خارجية (تفتح في نافذة جديدة)
    { 
      id: "external1", 
      title: "⚽ beIN Sports 1 (External)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "external",
      externalUrl: "https://live.hibridsports.com/bein-sports-1-arabic-live-stream/",
      color: "#FF6B35"
    },
    { 
      id: "external2", 
      title: "⚽ beIN Sports 2 (External)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "external",
      externalUrl: "https://live.hibridsports.com/bein-sports-2-arabic-live-stream/",
      color: "#00A8E8"
    },
    { 
      id: "external3", 
      title: "⚽ beIN Sports 3 (External)", 
      category: "sports", 
      quality: "HD", 
      lang: "en", 
      type: "external",
      externalUrl: "https://live.hibridsports.com/bein-sports-3-english-live-stream/",
      color: "#6A0572"
    },
    { 
      id: "external4", 
      title: "⚽ beIN Sports 4 (External)", 
      category: "sports", 
      quality: "HD", 
      lang: "fr", 
      type: "external",
      externalUrl: "https://live.hibridsports.com/bein-sports-4-french-live-stream/",
      color: "#FFD166"
    },

    // قنوات جزائرية خارجية (تفتح في نافذة جديدة)
    { 
      id: "external5", 
      title: "🇩🇿 Canal Algérie (External)", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      type: "external",
      externalUrl: "https://www.algeriainfo.com/canal-algerie-en-direct/",
      color: "#006400"
    },
    { 
      id: "external6", 
      title: "🇩🇿 Algerie 24 (External)", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      type: "external",
      externalUrl: "https://www.algeriainfo.com/algerie-24-en-direct/",
      color: "#8B0000"
    },
    { 
      id: "external7", 
      title: "🇩🇿 El Bilad TV (External)", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      type: "external",
      externalUrl: "https://www.elbilad.net/live",
      color: "#4682B4"
    },
    { 
      id: "external8", 
      title: "🇩🇿 A3 Algerie (External)", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      type: "external",
      externalUrl: "https://www.a3algerie.com/live",
      color: "#800080"
    },

    // قنوات أفلام خارجية
    { 
      id: "external9", 
      title: "🎬 Rakuten Movies (External)", 
      category: "movies", 
      quality: "FHD", 
      lang: "en", 
      type: "external",
      externalUrl: "https://rakuten.tv/live",
      color: "#FF1493"
    },
    { 
      id: "external10", 
      title: "🎬 Pluto TV (External)", 
      category: "movies", 
      quality: "HD", 
      lang: "en", 
      type: "external",
      externalUrl: "https://pluto.tv/live-tv",
      color: "#00CED1"
    },
  ];

  // 🔥 قنوات مباشرة تعمل داخل الموقع (بدون بروكسي)
  const directChannels = [
    // قنوات اختبار داخلية (MP4 - تعمل دائماً)
    { 
      id: "test1", 
      title: "📺 Test Channel 1 (MP4)", 
      category: "test", 
      quality: "HD", 
      lang: "en", 
      type: "direct",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      color: "#00FF88"
    },
    { 
      id: "test2", 
      title: "📺 Test Channel 2 (MP4)", 
      category: "test", 
      quality: "HD", 
      lang: "en", 
      type: "direct",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      color: "#FFAA00"
    },
    // قنوات HLS داخلية
    { 
      id: "direct1", 
      title: "📡 HLS Test 1", 
      category: "test", 
      quality: "HD", 
      lang: "en", 
      type: "direct",
      url: "https://bitdash-a.akamaihd.net/s/content/media/renditions/_livesim_/live_2000_400.m3u8",
      color: "#4169E1"
    },
  ];

  // 🔥 قنوات تعمل عبر البروكسي (النظام الأصلي)
  const proxyChannels = [
    { 
      id: "proxy1", 
      title: "🛡️ BeIN Sport 1 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy2", 
      title: "🛡️ BeIN Sport 2 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy3", 
      title: "🛡️ BeIN Sport 3 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy4", 
      title: "🛡️ BeIN Sport 4 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy5", 
      title: "🛡️ BeIN Sport 5 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy6", 
      title: "🛡️ BeIN Sport 6 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy7", 
      title: "🛡️ BeIN Sport 7 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy8", 
      title: "🛡️ BeIN Sport 8 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
    { 
      id: "proxy9", 
      title: "🛡️ BeIN Sport 9 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      type: "proxy" 
    },
  ];

  // جميع القنوات معاً
  const allChannels = [...externalChannels, ...directChannels, ...proxyChannels];

  // دالة الحصول على رابط القناة
  const getChannelUrl = (channel) => {
    switch(channel.type) {
      case "direct":
        return channel.url;
      case "proxy":
        const channelNum = channel.id.replace('proxy', '');
        return `/api/streams/beinsport${channelNum}_.m3u8`;
      case "external":
        return "#"; // للقنوات الخارجية، لن نستخدمها داخلياً
      default:
        return "";
    }
  };

  // التصنيفات
  const categories = [
    { id: "all", name: "جميع القنوات", icon: "📺" },
    { id: "sports", name: "رياضة", icon: "⚽" },
    { id: "national", name: "وطنية", icon: "🇩🇿" },
    { id: "movies", name: "أفلام", icon: "🎬" },
    { id: "test", name: "اختبار", icon: "🔧" },
  ];

  // تصفية القنوات
  const [category, setCategory] = useState("all");
  const filteredChannels = allChannels.filter(ch => {
    const matchesSearch = search === "" || 
      ch.title.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === "all" || ch.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // تحميل HLS.js ديناميكياً
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    s.onload = () => console.log("hls.js loaded");
    s.onerror = () => console.warn("hls.js failed to load");
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // دالة تشغيل القناة
  async function playChannel(ch) {
    if (ch.type === "external") {
      // القنوات الخارجية تفتح في نافذة جديدة
      window.open(ch.externalUrl, '_blank', 'noopener,noreferrer,width=1200,height=700');
      return;
    }

    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

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

      const streamUrl = getChannelUrl(ch);
      console.log(`Playing: ${ch.title} - Type: ${ch.type} - URL: ${streamUrl}`);

      // إعداد الفيديو
      video.src = streamUrl;
      video.muted = muted;
      
      // إذا كان MP4، شغله مباشرة
      if (streamUrl.includes('.mp4')) {
        try {
          await video.play();
        } catch (e) {
          console.error("MP4 play error:", e);
          setError("خطأ في تشغيل الفيديو. حاول تفعيل الصوت.");
        }
        return;
      }

      // إذا كان m3u8، استخدم HLS.js أو التشغيل الأصلي
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        try {
          await video.play();
        } catch (e) {
          console.error("Native HLS play error:", e);
          setError("خطأ في تشغيل البث. حاول قناة أخرى.");
        }
      } 
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
            } catch (e) {
              console.error("HLS.js play error:", e);
              setError("تعذر تشغيل الفيديو. حاول تفعيل الصوت.");
            }
          });
          
          hls.on(window.Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              setError(`خطأ في البث (${ch.type}). حاول قناة أخرى.`);
            }
          });
        } else {
          setError("المتصفح لا يدعم تشغيل HLS.");
        }
      } else {
        setError("جاري تحميل مشغل الفيديو... انتظر قليلاً.");
      }
    } catch (error) {
      console.error("Error playing channel:", error);
      setError("خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  // دالة فتح القناة الخارجية
  function openExternalChannel(ch) {
    if (ch.externalUrl) {
      window.open(ch.externalUrl, '_blank', 'noopener,noreferrer,width=1200,height=700');
    }
  }

  function overlayPlay() {
    const ch = active ? allChannels.find(c => c.id === active) : directChannels[0];
    if (ch) playChannel(ch);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  // دالة التكبير الكامل للشاشة
  function toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container');
    
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setFullscreen(false);
    }
  }

  // مراقبة تغييرات وضع الشاشة الكاملة
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // تنظيف HLS عند إغلاق الصفحة
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
        <title>MISTER-AI-LIVE — نظام البث المتعدد</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg-dark: #0a0a1a;
            --bg-card: rgba(15, 20, 40, 0.95);
            --primary: #00e0d6;
            --primary-dark: #00b4a9;
            --accent: #ff2a6d;
            --external: #FF6B35;
            --direct: #00FF88;
            --proxy: #FFAA00;
            --text: #ffffff;
            --text-secondary: #b0b8d0;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body, #__next {
            min-height: 100vh;
            font-family: 'Cairo', sans-serif;
            background: var(--bg-dark);
            color: var(--text);
            overflow-x: hidden;
          }

          body {
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 224, 214, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a1a 0%, #151530 100%);
          }

          /* Header */
          .header {
            padding: 20px 40px;
            background: rgba(10, 10, 26, 0.95);
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(0, 224, 214, 0.15);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .logo-icon {
            width: 55px;
            height: 55px;
            background: linear-gradient(135deg, var(--primary), var(--external), var(--direct));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(0, 224, 214, 0.4);
            animation: glow 3s ease-in-out infinite alternate;
          }

          @keyframes glow {
            from { box-shadow: 0 0 20px rgba(0, 224, 214, 0.4); }
            to { box-shadow: 0 0 40px rgba(255, 107, 53, 0.6); }
          }

          .logo-text {
            font-size: 26px;
            font-weight: 900;
            background: linear-gradient(45deg, var(--primary), var(--external), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }

          .logo-subtext {
            font-size: 13px;
            color: var(--text-secondary);
            margin-top: -2px;
            letter-spacing: 0.5px;
          }

          .system-status {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .status-badge {
            padding: 10px 18px;
            border-radius: 25px;
            font-weight: 800;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s;
            cursor: pointer;
            border: 2px solid transparent;
          }

          .status-badge:hover {
            transform: translateY(-3px);
          }

          .status-external {
            background: linear-gradient(45deg, var(--external), #FF8C42);
            color: #001217;
            border-color: rgba(255, 107, 53, 0.3);
          }

          .status-direct {
            background: linear-gradient(45deg, var(--direct), #00CC6D);
            color: #001217;
            border-color: rgba(0, 255, 136, 0.3);
          }

          .status-proxy {
            background: linear-gradient(45deg, var(--proxy), #FF9900);
            color: #001217;
            border-color: rgba(255, 170, 0, 0.3);
          }

          .status-dot {
            width: 10px;
            height: 10px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }

          /* Main Container */
          .container {
            max-width: 1700px;
            margin: 0 auto;
            padding: 35px 25px;
          }

          /* Video Player Section */
          .player-section {
            display: grid;
            grid-template-columns: 2.2fr 1fr;
            gap: 35px;
            margin-bottom: 40px;
          }

          @media (max-width: 1200px) {
            .player-section {
              grid-template-columns: 1fr;
            }
          }

          /* Video Container */
          .video-container {
            background: var(--bg-card);
            border-radius: 25px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
            transition: all 0.4s ease;
            position: relative;
          }

          .video-container:fullscreen {
            background: #000;
            border-radius: 0;
            border: none;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .video-container:fullscreen .video-wrapper {
            padding-top: 0;
            flex: 1;
            height: calc(100vh - 130px);
          }

          .video-wrapper {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: linear-gradient(45deg, #000, #111);
          }

          .video-wrapper video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .video-container:fullscreen .video-wrapper video {
            object-fit: cover;
          }

          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
          }

          .video-wrapper:hover .video-overlay {
            opacity: 1;
          }

          .play-button {
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid var(--primary);
            transition: all 0.3s;
            backdrop-filter: blur(10px);
          }

          .play-button:hover {
            transform: scale(1.15);
            background: rgba(0, 224, 214, 0.3);
            box-shadow: 0 0 40px rgba(0, 224, 214, 0.5);
          }

          .play-button svg {
            width: 30px;
            height: 30px;
            fill: var(--primary);
            margin-left: 5px;
          }

          .video-info {
            padding: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
          }

          .channel-info-left {
            flex: 1;
          }

          .channel-name-display {
            font-size: 24px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .channel-meta {
            display: flex;
            align-items: center;
            gap: 20px;
            color: var(--text-secondary);
            font-size: 15px;
          }

          .channel-type-badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.5px;
            border: 2px solid;
            transition: all 0.3s;
          }

          .channel-type-badge:hover {
            transform: scale(1.05);
          }

          .channel-external {
            background: linear-gradient(45deg, rgba(255, 107, 53, 0.2), rgba(255, 140, 66, 0.1));
            color: var(--external);
            border-color: var(--external);
          }

          .channel-direct {
            background: linear-gradient(45deg, rgba(0, 255, 136, 0.2), rgba(0, 204, 109, 0.1));
            color: var(--direct);
            border-color: var(--direct);
          }

          .channel-proxy {
            background: linear-gradient(45deg, rgba(255, 170, 0, 0.2), rgba(255, 153, 0, 0.1));
            color: var(--proxy);
            border-color: var(--proxy);
          }

          .status-dot-active {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          .status-external-dot {
            background: var(--external);
            box-shadow: 0 0 15px var(--external);
          }

          .status-direct-dot {
            background: var(--direct);
            box-shadow: 0 0 15px var(--direct);
          }

          .status-proxy-dot {
            background: var(--proxy);
            box-shadow: 0 0 15px var(--proxy);
          }

          /* Controls */
          .controls {
            display: flex;
            gap: 12px;
            padding: 25px;
            background: rgba(0, 0, 0, 0.25);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }

          .control-button {
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.07);
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            letter-spacing: 0.5px;
          }

          .control-button:hover {
            background: rgba(0, 224, 214, 0.15);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 224, 214, 0.2);
          }

          .control-button svg {
            width: 18px;
            height: 18px;
          }

          .control-button.fullscreen {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            font-weight: 800;
          }

          .control-button.fullscreen:hover {
            background: linear-gradient(45deg, var(--primary-dark), var(--primary));
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 30px rgba(0, 224, 214, 0.3);
          }

          .control-button.external {
            background: linear-gradient(45deg, var(--external), #FF8C42);
            color: #001217;
            font-weight: 800;
            animation: externalGlow 2s infinite alternate;
          }

          @keyframes externalGlow {
            from { box-shadow: 0 0 15px rgba(255, 107, 53, 0.5); }
            to { box-shadow: 0 0 25px rgba(255, 107, 53, 0.8); }
          }

          .control-button.external:hover {
            background: linear-gradient(45deg, #FF8C42, var(--external));
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 35px rgba(255, 107, 53, 0.6);
          }

          /* Channels Panel */
          .channels-panel {
            background: var(--bg-card);
            border-radius: 25px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
          }

          .panel-header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .panel-title {
            font-size: 22px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .panel-title-icon {
            font-size: 28px;
          }

          .panel-subtitle {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.5;
          }

          /* Channels Filter */
          .channels-filter {
            display: flex;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 18px;
            padding: 8px;
            margin-bottom: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            gap: 8px;
          }

          .filter-button {
            flex: 1;
            padding: 15px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            border-radius: 14px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 15px;
          }

          .filter-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .filter-button.active {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            box-shadow: 0 8px 25px rgba(0, 224, 214, 0.25);
            transform: translateY(-2px);
          }

          .filter-button.external {
            background: linear-gradient(45deg, var(--external), #FF8C42);
            color: #001217;
          }

          /* Search Box */
          .search-container {
            position: relative;
            margin-bottom: 25px;
          }

          .search-input {
            width: 100%;
            padding: 18px 25px 18px 60px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(0, 224, 214, 0.15);
            border-radius: 18px;
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-size: 17px;
            transition: all 0.3s;
            font-weight: 500;
          }

          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 30px rgba(0, 224, 214, 0.15);
          }

          .search-icon {
            position: absolute;
            left: 25px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--primary);
            font-size: 20px;
          }

          /* Categories */
          .categories {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding-bottom: 20px;
            margin-bottom: 25px;
            scrollbar-width: thin;
          }

          .category-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            border: 2px solid transparent;
          }

          .category-btn:hover {
            background: rgba(0, 224, 214, 0.1);
            border-color: rgba(0, 224, 214, 0.3);
          }

          .category-btn.active {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            box-shadow: 0 8px 25px rgba(0, 224, 214, 0.25);
            border-color: transparent;
          }

          /* Channels Grid */
          .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 18px;
            max-height: 550px;
            overflow-y: auto;
            padding-right: 12px;
          }

          .channel-item {
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.4s;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
          }

          .channel-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--external), var(--direct), var(--proxy));
            opacity: 0;
            transition: opacity 0.3s;
          }

          .channel-item:hover {
            transform: translateY(-8px);
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          }

          .channel-item:hover::before {
            opacity: 1;
          }

          .channel-item.active {
            border-color: var(--primary);
            box-shadow: 0 25px 60px rgba(0, 224, 214, 0.15);
            background: rgba(0, 224, 214, 0.03);
          }

          .channel-item.external {
            border-left: 5px solid var(--external);
          }

          .channel-item.direct {
            border-left: 5px solid var(--direct);
          }

          .channel-item.proxy {
            border-left: 5px solid var(--proxy);
          }

          .channel-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }

          .channel-number {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
            color: #001217;
            flex-shrink: 0;
          }

          .external .channel-number {
            background: linear-gradient(45deg, var(--external), #FF8C42);
            box-shadow: 0 5px 20px rgba(255, 107, 53, 0.3);
          }

          .direct .channel-number {
            background: linear-gradient(45deg, var(--direct), #00CC6D);
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.3);
          }

          .proxy .channel-number {
            background: linear-gradient(45deg, var(--proxy), #FF9900);
            box-shadow: 0 5px 20px rgba(255, 170, 0, 0.3);
          }

          .channel-type-indicator {
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 900;
            font-size: 12px;
            letter-spacing: 0.5px;
            border: 2px solid;
          }

          .external-indicator {
            background: rgba(255, 107, 53, 0.15);
            color: var(--external);
            border-color: var(--external);
          }

          .direct-indicator {
            background: rgba(0, 255, 136, 0.15);
            color: var(--direct);
            border-color: var(--direct);
          }

          .proxy-indicator {
            background: rgba(255, 170, 0, 0.15);
            color: var(--proxy);
            border-color: var(--proxy);
          }

          .channel-name {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 12px;
            color: var(--text);
            line-height: 1.4;
          }

          .channel-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
          }

          .channel-quality {
            background: rgba(255, 42, 109, 0.2);
            color: #ff6b9d;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 13px;
          }

          .external-button {
            padding: 10px 20px;
            background: linear-gradient(45deg, var(--external), #FF8C42);
            color: #001217;
            border: none;
            border-radius: 15px;
            font-family: 'Cairo', sans-serif;
            font-weight: 900;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: 0.5px;
          }

          .external-button:hover {
            background: linear-gradient(45deg, #FF8C42, var(--external));
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(255, 107, 53, 0.4);
          }

          .play-button-small {
            padding: 10px 20px;
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            border: none;
            border-radius: 15px;
            font-family: 'Cairo', sans-serif;
            font-weight: 900;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: 0.5px;
          }

          .play-button-small:hover {
            background: linear-gradient(45deg, var(--primary-dark), var(--primary));
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 224, 214, 0.4);
          }

          /* Error Message */
          .error-message {
            background: rgba(255, 42, 109, 0.15);
            border: 2px solid var(--accent);
            color: #ffb8d0;
            padding: 20px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(255, 42, 109, 0.1);
          }

          /* Success Message */
          .success-message {
            background: linear-gradient(45deg, rgba(0, 224, 214, 0.1), rgba(255, 107, 53, 0.05));
            border: 2px solid rgba(0, 224, 214, 0.3);
            color: var(--primary);
            padding: 20px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.6;
            box-shadow: 0 10px 30px rgba(0, 224, 214, 0.1);
          }

          .success-message strong {
            color: var(--external);
          }

          /* Stats */
          .stats {
            display: flex;
            justify-content: center;
            gap: 35px;
            margin-top: 20px;
            font-size: 14px;
            flex-wrap: wrap;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s;
          }

          .stat-item:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-3px);
          }

          .stat-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            box-shadow: 0 0 15px currentColor;
          }

          .stat-dot.external {
            background: var(--external);
            animation: externalGlow 2s infinite alternate;
          }

          .stat-dot.direct {
            background: var(--direct);
            animation: pulse 2s infinite;
          }

          .stat-dot.proxy {
            background: var(--proxy);
            animation: pulse 2s infinite;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding: 35px 25px;
            margin-top: 60px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            color: var(--text-secondary);
            font-size: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 25px;
            backdrop-filter: blur(10px);
          }

          .footer-logo {
            color: var(--primary);
            font-weight: 900;
            margin-bottom: 15px;
            font-size: 22px;
            letter-spacing: 1px;
          }

          .footer-text {
            opacity: 0.8;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
          }

          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, var(--primary), var(--external));
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, var(--external), var(--direct));
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .header {
              padding: 15px 25px;
              flex-direction: column;
              gap: 20px;
            }

            .system-status {
              width: 100%;
              justify-content: center;
            }

            .container {
              padding: 25px 15px;
            }

            .channels-grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            }

            .controls {
              flex-wrap: wrap;
            }

            .control-button {
              flex: 1;
              min-width: 140px;
            }

            .video-info {
              flex-direction: column;
              gap: 20px;
              align-items: flex-start;
            }
          }

          @media (max-width: 768px) {
            .logo-text {
              font-size: 22px;
            }

            .logo-icon {
              width: 45px;
              height: 45px;
            }

            .status-badge {
              padding: 8px 15px;
              font-size: 13px;
            }

            .control-button {
              padding: 12px 20px;
              font-size: 14px;
            }

            .channels-grid {
              grid-template-columns: 1fr;
            }

            .categories {
              flex-wrap: wrap;
            }

            .category-btn {
              padding: 10px 20px;
              font-size: 14px;
            }

            .stats {
              gap: 15px;
            }

            .stat-item {
              padding: 10px 15px;
            }
          }

          @media (max-width: 480px) {
            .header {
              padding: 15px;
            }

            .logo-text {
              font-size: 20px;
            }

            .logo-icon {
              width: 40px;
              height: 40px;
            }

            .control-button {
              min-width: 100%;
              justify-content: center;
            }

            .channel-name {
              font-size: 16px;
            }

            .footer {
              padding: 25px 15px;
            }
          }
        `}</style>
      </Head>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#001217"/>
              <path d="M2 17L12 22L22 17" stroke="#001217" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#001217" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">MISTER-AI-LIVE</div>
            <div className="logo-subtext">نظام البث المتعدد - مباشر + خارجي + بروكسي</div>
          </div>
        </div>
        <div className="system-status">
          <div className="status-badge status-external" onClick={() => setCategory('sports')}>
            <div className="status-dot"></div>
            <span>خارجي: {externalChannels.length}</span>
          </div>
          <div className="status-badge status-direct" onClick={() => setCategory('test')}>
            <div className="status-dot"></div>
            <span>مباشر: {directChannels.length}</span>
          </div>
          <div className="status-badge status-proxy" onClick={() => setShowAllChannels(true)}>
            <div className="status-dot"></div>
            <span>بروكسي: {proxyChannels.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="player-section">
          {/* Video Player */}
          <div className="video-container">
            <div className="video-wrapper">
              <video 
                ref={videoRef} 
                controls 
                playsInline 
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="video-overlay" onClick={overlayPlay}>
                <div className="play-button">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="video-info">
              <div className="channel-info-left">
                <div className="channel-name-display">
                  {active ? allChannels.find(c => c.id === active)?.title : "اختر قناة للبدأ"}
                </div>
                <div className="channel-meta">
                  {active && (
                    <>
                      <span className={`channel-type-badge ${
                        allChannels.find(c => c.id === active)?.type === 'external' ? 'channel-external' :
                        allChannels.find(c => c.id === active)?.type === 'direct' ? 'channel-direct' : 'channel-proxy'
                      }`}>
                        {allChannels.find(c => c.id === active)?.type === 'external' ? '🌐 خارجي' :
                         allChannels.find(c => c.id === active)?.type === 'direct' ? '🔗 مباشر' : '🛡️ بروكسي'}
                      </span>
                      <span>{allChannels.find(c => c.id === active)?.quality}</span>
                      <span>{allChannels.find(c => c.id === active)?.lang?.toUpperCase()}</span>
                      <div className={`status-dot-active ${
                        allChannels.find(c => c.id === active)?.type === 'external' ? 'status-external-dot' :
                        allChannels.find(c => c.id === active)?.type === 'direct' ? 'status-direct-dot' : 'status-proxy-dot'
                      }`}></div>
                      <span>{active ? "جاري التشغيل" : "متوقف"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="controls">
              <button className="control-button" onClick={() => {
                const ch = active ? allChannels.find(c => c.id === active) : directChannels[0];
                if (ch) playChannel(ch);
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                إعادة تشغيل
              </button>

              <button className="control-button" onClick={toggleMute}>
                {muted ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                    إلغاء الكتم
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    كتم الصوت
                  </>
                )}
              </button>

              <button className="control-button external" onClick={() => {
                const ch = active ? allChannels.find(c => c.id === active) : externalChannels[0];
                if (ch && ch.type === 'external') {
                  openExternalChannel(ch);
                } else {
                  // إذا لم تكن القناة خارجية، فتح أول قناة خارجية
                  openExternalChannel(externalChannels[0]);
                }
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                فتح خارجياً
              </button>

              <button className="control-button fullscreen" onClick={toggleFullscreen}>
                {fullscreen ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                    خروج من الشاشة الكاملة
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    شاشة كاملة
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channels Panel */}
          <div className="channels-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-title-icon">📡</span>
                القنوات المتاحة ({filteredChannels.length})
              </div>
              <div className="panel-subtitle">
                اختر قناة للبث المباشر داخل الموقع، أو افتح قناة خارجية في نافذة جديدة
              </div>
            </div>

            {/* Channels Filter */}
            <div className="channels-filter">
              <button 
                className={`filter-button ${category === 'sports' ? 'active' : ''}`}
                onClick={() => setCategory('sports')}
              >
                ⚽ رياضية
              </button>
              <button 
                className={`filter-button ${category === 'national' ? 'active' : ''}`}
                onClick={() => setCategory('national')}
              >
                🇩🇿 جزائرية
              </button>
              <button 
                className={`filter-button ${category === 'all' ? 'active' : ''}`}
                onClick={() => setCategory('all')}
              >
                📺 جميع
              </button>
            </div>

            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="ابحث عن قناة رياضية، جزائرية، أو أفلام..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Channels Grid */}
            <div className="channels-grid">
              {filteredChannels.map((ch) => (
                <div
                  key={ch.id}
                  className={`channel-item ${ch.type} ${active === ch.id ? 'active' : ''}`}
                >
                  <div className="channel-header">
                    <div className="channel-number">
                      {ch.type === 'external' ? '🌐' : 
                       ch.type === 'direct' ? '🔗' : '🛡️'}
                    </div>
                    <span className={`channel-type-indicator ${
                      ch.type === 'external' ? 'external-indicator' :
                      ch.type === 'direct' ? 'direct-indicator' : 'proxy-indicator'
                    }`}>
                      {ch.type === 'external' ? 'خارجي' : 
                       ch.type === 'direct' ? 'مباشر' : 'بروكسي'}
                    </span>
                  </div>
                  
                  <div className="channel-name">
                    {ch.title}
                  </div>
                  
                  <div className="channel-details">
                    <span className="channel-quality">{ch.quality}</span>
                    
                    {ch.type === 'external' ? (
                      <button 
                        className="external-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openExternalChannel(ch);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                        </svg>
                        فتح خارجياً
                      </button>
                    ) : (
                      <button 
                        className="play-button-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          playChannel(ch);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        تشغيل
                      </button>
                    )}
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
          🚀 <strong>نظام البث المتعدد:</strong> 
          <br />
          🌐 <strong>القنوات الخارجية:</strong> تفتح في نافذة جديدة (رياضية + جزائرية + أفلام)
          <br />
          🔗 <strong>القنوات المباشرة:</strong> تعمل داخل الموقع بدون بروكسي
          <br />
          🛡️ <strong>القنوات البروكسية:</strong> تعمل داخل الموقع عبر نظام الحماية
        </div>

        <div className="stats">
          <div className="stat-item">
            <div className="stat-dot external"></div>
            <span>قنوات خارجية: {externalChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot direct"></div>
            <span>قنوات مباشرة: {directChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot proxy"></div>
            <span>قنوات بروكسي: {proxyChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot external"></div>
            <span>إجمالي: {allChannels.length} قناة</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-logo">MISTER-AI-LIVE</div>
        <div className="footer-text">
          © 2026 MISTERAI LIVE — نظام البث المتعدد المتطور
          <br />
          <small>دمج القنوات الخارجية + المباشرة + البروكسية في نظام واحد متكامل</small>
          <br />
          <small>قم بفتح القنوات الرياضية والجزائرية في نافذة خارجية بنقرة واحدة!</small>
        </div>
      </footer>
    </>
  );
}
