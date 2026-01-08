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

  // 🔥 القنوات المباشرة (بدون بروكسي) - تعمل مباشرة
  const directChannels = [
    // قنوات رياضية مباشرة
    { id: "sports1", title: "⚽ beIN Sports 1 (Direct)", category: "sports", quality: "HD", lang: "ar", direct: true, url: "https://bitdash-a.akamaihd.net/s/content/media/renditions/_livesim_/live_2000_400.m3u8" },
    { id: "sports2", title: "⚽ beIN Sports 2 (Direct)", category: "sports", quality: "HD", lang: "ar", direct: true, url: "https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8" },
    
    // قنوات جزائرية مباشرة
    { id: "dz1", title: "🇩🇿 ALG 24 News (Direct)", category: "national", quality: "HD", lang: "ar", direct: true, url: "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/algerie_4/hls_snrt/index.m3u8" },
    { id: "dz2", title: "🇩🇿 Canal Algérie (Direct)", category: "national", quality: "HD", lang: "ar", direct: true, url: "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/canal_algerie/hls_snrt/index.m3u8" },
    
    // قنوات أفلام مباشرة
    { id: "movie1", title: "🎬 Movies Action (Direct)", category: "movies", quality: "FHD", lang: "en", direct: true, url: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8" },
    { id: "movie2", title: "🎬 Movies Comedy (Direct)", category: "movies", quality: "HD", lang: "en", direct: true, url: "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8" },
    
    // قنوات اختبار MP4 (تعمل دائماً)
    { id: "test1", title: "📺 Test Channel 1 (MP4)", category: "test", quality: "HD", lang: "en", direct: true, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    { id: "test2", title: "📺 Test Channel 2 (MP4)", category: "test", quality: "HD", lang: "en", direct: true, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
  ];

  // 🔥 القنوات عبر بروكسي (النظام الأصلي)
  const proxyChannels = [
    { id: "proxy1", title: "BeIN Sport 1 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy2", title: "BeIN Sport 2 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy3", title: "BeIN Sport 3 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy4", title: "BeIN Sport 4 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy5", title: "BeIN Sport 5 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy6", title: "BeIN Sport 6 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy7", title: "BeIN Sport 7 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy8", title: "BeIN Sport 8 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
    { id: "proxy9", title: "BeIN Sport 9 (Proxy)", category: "sports", quality: "HD", lang: "ar", direct: false },
  ];

  // دالة الحصول على رابط القناة
  const getChannelUrl = (channel) => {
    if (channel.direct) {
      // القنوات المباشرة
      return channel.url;
    } else {
      // القنوات عبر بروكسي (النظام الأصلي)
      const channelNum = channel.id.replace('proxy', '');
      return `/api/streams/beinsport${channelNum}_.m3u8`;
    }
  };

  // جميع القنوات معاً
  const allChannels = [...directChannels, ...proxyChannels];

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

  // عرض القنوات (مباشرة فقط أو كلها)
  const displayedChannels = showAllChannels ? filteredChannels : filteredChannels.filter(ch => ch.direct);

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
      console.log(`Playing: ${ch.title} - URL: ${streamUrl} - Direct: ${ch.direct}`);

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
      // Safari يدعم HLS أصلياً
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        try {
          await video.play();
        } catch (e) {
          console.error("Native HLS play error:", e);
          setError("خطأ في تشغيل البث. حاول قناة أخرى.");
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
            } catch (e) {
              console.error("HLS.js play error:", e);
              setError("تعذر تشغيل الفيديو. حاول تفعيل الصوت.");
            }
          });
          
          hls.on(window.Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              setError(`خطأ في البث (${ch.direct ? 'Direct' : 'Proxy'}). حاول قناة أخرى.`);
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
        <title>MISTER-AI-LIVE — البث المباشر المزدوج</title>
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
            --success: #00ff88;
            --warning: #ffaa00;
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
              radial-gradient(circle at 80% 70%, rgba(255, 42, 109, 0.05) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a1a 0%, #151530 100%);
          }

          /* Header */
          .header {
            padding: 20px 40px;
            background: rgba(10, 10, 26, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 224, 214, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0, 224, 214, 0.3);
            animation: rotate 10s linear infinite;
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
          }

          .logo-subtext {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: -3px;
          }

          .system-status {
            display: flex;
            gap: 15px;
            align-items: center;
          }

          .status-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .status-direct {
            background: linear-gradient(45deg, var(--success), #00cc6d);
            color: #001217;
          }

          .status-proxy {
            background: linear-gradient(45deg, var(--warning), #ff9900);
            color: #001217;
          }

          .status-dot {
            width: 8px;
            height: 8px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          /* Main Container */
          .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 30px 20px;
          }

          /* Video Player Section */
          .player-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }

          @media (max-width: 1024px) {
            .player-section {
              grid-template-columns: 1fr;
            }
          }

          /* Video Container */
          .video-container {
            background: var(--bg-card);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
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
            height: calc(100vh - 120px);
          }

          .video-wrapper {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: #000;
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
            background: rgba(0, 0, 0, 0.5);
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
            width: 70px;
            height: 70px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--primary);
            transition: all 0.3s;
          }

          .play-button:hover {
            transform: scale(1.1);
            background: rgba(0, 224, 214, 0.2);
          }

          .play-button svg {
            width: 25px;
            height: 25px;
            fill: var(--primary);
            margin-left: 3px;
          }

          .video-info {
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .channel-info-left {
            flex: 1;
          }

          .channel-name-display {
            font-size: 22px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .channel-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            color: var(--text-secondary);
            font-size: 14px;
          }

          .channel-type-badge {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 700;
          }

          .channel-direct {
            background: rgba(0, 255, 136, 0.2);
            color: var(--success);
            border: 1px solid var(--success);
          }

          .channel-proxy {
            background: rgba(255, 170, 0, 0.2);
            color: var(--warning);
            border: 1px solid var(--warning);
          }

          .status-dot-active {
            width: 8px;
            height: 8px;
            background: var(--success);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          /* Controls */
          .controls {
            display: flex;
            gap: 10px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .control-button {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .control-button:hover {
            background: rgba(0, 224, 214, 0.1);
            transform: translateY(-2px);
          }

          .control-button svg {
            width: 16px;
            height: 16px;
          }

          .control-button.fullscreen {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            font-weight: 700;
          }

          .control-button.fullscreen:hover {
            background: linear-gradient(45deg, var(--primary-dark), var(--primary));
            transform: translateY(-2px) scale(1.05);
          }

          /* Channels Panel */
          .channels-panel {
            background: var(--bg-card);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          }

          .panel-header {
            margin-bottom: 25px;
          }

          .panel-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 5px;
          }

          .panel-subtitle {
            color: var(--text-secondary);
            font-size: 14px;
          }

          /* Channel Toggle */
          .channels-toggle {
            display: flex;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 5px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .toggle-button {
            flex: 1;
            padding: 12px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            cursor: pointer;
            border-radius: 12px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
          }

          .toggle-button.active {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            box-shadow: 0 4px 15px rgba(0, 224, 214, 0.2);
          }

          /* Search Box */
          .search-container {
            position: relative;
            margin-bottom: 20px;
          }

          .search-input {
            width: 100%;
            padding: 15px 20px 15px 50px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 224, 214, 0.1);
            border-radius: 12px;
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-size: 16px;
            transition: all 0.3s;
          }

          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 20px rgba(0, 224, 214, 0.1);
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
            background: rgba(255, 255, 255, 0.05);
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .category-btn:hover {
            background: rgba(0, 224, 214, 0.1);
          }

          .category-btn.active {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            box-shadow: 0 4px 15px rgba(0, 224, 214, 0.2);
          }

          /* Channels Grid */
          .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            max-height: 500px;
            overflow-y: auto;
            padding-right: 10px;
          }

          .channel-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
          }

          .channel-item:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .channel-item.active {
            border-color: var(--primary);
            box-shadow: 0 10px 30px rgba(0, 224, 214, 0.1);
          }

          .channel-item.direct {
            border-left: 4px solid var(--success);
          }

          .channel-item.proxy {
            border-left: 4px solid var(--warning);
          }

          .channel-number {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 30px;
            height: 30px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
          }

          .direct .channel-number {
            background: rgba(0, 255, 136, 0.2);
            color: var(--success);
          }

          .proxy .channel-number {
            background: rgba(255, 170, 0, 0.2);
            color: var(--warning);
          }

          .channel-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .channel-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: var(--text-secondary);
          }

          .channel-quality {
            background: rgba(255, 42, 109, 0.2);
            color: #ff6b9d;
            padding: 4px 10px;
            border-radius: 20px;
          }

          .channel-type-indicator {
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 11px;
          }

          .direct-indicator {
            background: rgba(0, 255, 136, 0.2);
            color: var(--success);
            border: 1px solid var(--success);
          }

          .proxy-indicator {
            background: rgba(255, 170, 0, 0.2);
            color: var(--warning);
            border: 1px solid var(--warning);
          }

          /* Error Message */
          .error-message {
            background: rgba(255, 42, 109, 0.1);
            border: 1px solid var(--accent);
            color: #ffb8d0;
            padding: 15px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
            font-size: 14px;
          }

          /* Success Message */
          .success-message {
            background: rgba(0, 224, 214, 0.1);
            border: 1px solid var(--primary);
            color: var(--primary);
            padding: 15px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
            font-size: 14px;
          }

          /* Fullscreen Hint */
          .fullscreen-hint {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: var(--primary);
            padding: 8px 15px;
            border-radius: 10px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 5;
            opacity: 0.8;
            transition: opacity 0.3s;
            cursor: pointer;
          }

          .fullscreen-hint:hover {
            opacity: 1;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding: 30px 20px;
            margin-top: 50px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            color: var(--text-secondary);
            font-size: 14px;
          }

          .footer-logo {
            color: var(--primary);
            font-weight: 800;
            margin-bottom: 10px;
            font-size: 18px;
          }

          .footer-text {
            opacity: 0.7;
          }

          /* Stats */
          .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
            font-size: 12px;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .stat-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .stat-dot.direct {
            background: var(--success);
          }

          .stat-dot.proxy {
            background: var(--warning);
          }

          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            border-radius: 10px;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .header {
              padding: 15px 20px;
              flex-direction: column;
              gap: 15px;
            }

            .system-status {
              flex-direction: column;
              gap: 10px;
            }

            .container {
              padding: 15px;
            }

            .channels-grid {
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }

            .controls {
              flex-wrap: wrap;
            }

            .control-button {
              flex: 1;
              min-width: 120px;
            }

            .video-info {
              flex-direction: column;
              gap: 15px;
              align-items: flex-start;
            }
          }

          @media (max-width: 480px) {
            .channels-grid {
              grid-template-columns: 1fr;
            }

            .logo-text {
              font-size: 20px;
            }

            .logo-icon {
              width: 40px;
              height: 40px;
            }

            .control-button {
              padding: 10px 15px;
              font-size: 13px;
            }

            .categories {
              flex-wrap: wrap;
            }

            .category-btn {
              padding: 8px 15px;
              font-size: 13px;
            }
          }
        `}</style>
      </Head>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#001217"/>
              <path d="M2 17L12 22L22 17" stroke="#001217" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#001217" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">MISTER-AI-LIVE</div>
            <div className="logo-subtext">نظام البث المباشر المزدوج</div>
          </div>
        </div>
        <div className="system-status">
          <div className="status-badge status-direct">
            <div className="status-dot"></div>
            <span>قنوات مباشرة: {directChannels.length}</span>
          </div>
          <div className="status-badge status-proxy">
            <div className="status-dot"></div>
            <span>قنوات بروكسي: {proxyChannels.length}</span>
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
                      <span className={`channel-type-badge ${allChannels.find(c => c.id === active)?.direct ? 'channel-direct' : 'channel-proxy'}`}>
                        {allChannels.find(c => c.id === active)?.direct ? '🔗 مباشر' : '🛡️ بروكسي'}
                      </span>
                      <span>{allChannels.find(c => c.id === active)?.quality}</span>
                      <span>{allChannels.find(c => c.id === active)?.lang?.toUpperCase()}</span>
                      <div className="status-dot-active"></div>
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

            {!fullscreen && (
              <div className="fullscreen-hint" onClick={toggleFullscreen}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
                انقر للتكبير الكامل
              </div>
            )}
          </div>

          {/* Channels Panel */}
          <div className="channels-panel">
            <div className="panel-header">
              <div className="panel-title">القنوات المتاحة ({displayedChannels.length})</div>
              <div className="panel-subtitle">
                {showAllChannels ? 'جميع القنوات (مباشرة + بروكسي)' : 'القنوات المباشرة فقط'}
              </div>
            </div>

            {/* Channel Type Toggle */}
            <div className="channels-toggle">
              <button 
                className={`toggle-button ${!showAllChannels ? 'active' : ''}`}
                onClick={() => setShowAllChannels(false)}
              >
                <span>🔗</span>
                مباشرة فقط
              </button>
              <button 
                className={`toggle-button ${showAllChannels ? 'active' : ''}`}
                onClick={() => setShowAllChannels(true)}
              >
                <span>🔄</span>
                جميع القنوات
              </button>
            </div>

            {/* Search */}
            <div className="search-container">
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
              {displayedChannels.map((ch) => (
                <div
                  key={ch.id}
                  className={`channel-item ${ch.direct ? 'direct' : 'proxy'} ${active === ch.id ? 'active' : ''}`}
                  onClick={() => playChannel(ch)}
                >
                  <div className="channel-number">
                    {ch.direct ? '🔗' : '🛡️'}
                  </div>
                  <div className="channel-name">
                    {ch.title}
                  </div>
                  <div className="channel-details">
                    <span className="channel-quality">{ch.quality}</span>
                    <span className={`channel-type-indicator ${ch.direct ? 'direct-indicator' : 'proxy-indicator'}`}>
                      {ch.direct ? 'مباشر' : 'بروكسي'}
                    </span>
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
          💡 <strong>نظام البث المزدوج:</strong> 
          القنوات المباشرة (🔗) تعمل بدون بروكسي - القنوات البروكسية (🛡️) تعمل عبر نظام الحماية
        </div>
      </main>

      <footer className="footer">
        <div className="footer-logo">MISTER-AI-LIVE</div>
        <div className="footer-text">
          © 2026 MISTERAI LIVE — نظام البث المباشر المزدوج
          <br />
          <small>مباشر + بروكسي لنظام بث متكامل</small>
        </div>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-dot direct"></div>
            <span>قنوات مباشرة: {directChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot proxy"></div>
            <span>قنوات بروكسي: {proxyChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot-active"></div>
            <span>إجمالي القنوات: {allChannels.length}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
