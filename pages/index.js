import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // القنوات الأصلية كما كانت في المشروع
  const channels = [
    { id: "1", title: "BeIN Sport 1" },
    { id: "2", title: "BeIN Sport 2" },
    { id: "3", title: "BeIN Sport 3" },
    { id: "4", title: "BeIN Sport 4" },
    { id: "5", title: "BeIN Sport 5" },
    { id: "6", title: "BeIN Sport 6" },
    { id: "7", title: "BeIN Sport 7" },
    { id: "8", title: "BeIN Sport 8" },
    { id: "9", title: "BeIN Sport 9" }
  ];

  // دالة الحصول على رابط القناة - النظام الأصلي
  const getChannelUrl = (channelId) => {
    // استخدام نظام البروكسي الأصلي
    return `/api/streams/beinsport${channelId}_.m3u8`;
  };

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

  // دالة تشغيل القناة - النظام الأصلي المعدل
  function playChannel(ch) {
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = getChannelUrl(ch.id);
    console.log(`Playing: ${ch.title} - URL: ${streamUrl}`);

    // إذا كان المتصفح يدعم HLS أصلياً (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        video.src = streamUrl;
        video.muted = muted;
        video.play().catch(e => {
          console.error("Native HLS play error:", e);
          setError("تعذر تشغيل البث — حاول تفعيل الصوت");
        });
        return;
      } catch (e) {
        console.error("Native HLS setup error:", e);
      }
    }

    // للمتصفحات الأخرى، استخدم HLS.js
    const Hls = window.Hls;
    if (!Hls) {
      video.src = streamUrl;
      video.muted = muted;
      video.play().catch(e => {
        console.error("Direct play error:", e);
        setError("جاري تحميل مشغل الفيديو... انتظر قليلاً");
      });
      return;
    }

    // استخدام HLS.js
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (e) {
        console.warn("HLS destroy error:", e);
      }
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferSize: 30 * 1000 * 1000,
        maxBufferLength: 30,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      });
      
      hlsRef.current = hls;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = muted;
        video.play().catch(e => {
          console.error("HLS play error:", e);
          setError("تعذر تشغيل الفيديو — حاول تفعيل الصوت");
        });
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("خطأ في الشبكة — حاول قناة أخرى");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("خطأ في الوسائط — حاول قناة أخرى");
              hls.recoverMediaError();
              break;
            default:
              setError("خطأ في البث — حاول مرة أخرى");
              break;
          }
        }
      });
    } else {
      setError("المتصفح لا يدعم تشغيل HLS");
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
        <title>MISTER-AI-LIVE — البث المباشر</title>
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

          .live-indicator {
            background: linear-gradient(45deg, var(--accent), #ff6b9d);
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(255, 42, 109, 0.3);
          }

          .live-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          /* Main Container */
          .container {
            max-width: 1400px;
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

          .video-container {
            background: var(--bg-card);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
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
          }

          .channel-name-display {
            font-size: 22px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 10px;
          }

          .channel-status {
            display: flex;
            align-items: center;
            gap: 15px;
            color: var(--text-secondary);
            font-size: 14px;
          }

          .status-dot {
            width: 8px;
            height: 8px;
            background: var(--primary);
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
            margin-bottom: 10px;
          }

          .panel-subtitle {
            color: var(--text-secondary);
            font-size: 14px;
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
          }

          .search-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--primary);
          }

          /* Channels Grid */
          .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            max-height: 400px;
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
            background: rgba(0, 224, 214, 0.05);
            border-color: var(--primary);
            transform: translateY(-5px);
          }

          .channel-item.active {
            background: linear-gradient(135deg, 
              rgba(0, 224, 214, 0.1), 
              rgba(0, 180, 169, 0.05)
            );
            border-color: var(--primary);
            box-shadow: 0 10px 30px rgba(0, 224, 214, 0.1);
          }

          .channel-number {
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--accent);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 8px;
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
            color: var(--text);
          }

          .channel-info {
            display: flex;
            gap: 10px;
            font-size: 12px;
            color: var(--text-secondary);
          }

          .channel-type {
            background: rgba(0, 224, 214, 0.1);
            color: var(--primary);
            padding: 4px 10px;
            border-radius: 20px;
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

          /* Scrollbar Styling */
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

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, var(--primary-dark), var(--primary));
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .header {
              padding: 15px 20px;
              flex-direction: column;
              gap: 15px;
            }

            .container {
              padding: 15px;
            }

            .channels-grid {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }

            .controls {
              flex-wrap: wrap;
            }

            .control-button {
              flex: 1;
              min-width: 120px;
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
            <div className="logo-subtext">نظام البث المباشر المتطور</div>
          </div>
        </div>
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span>مباشر LIVE</span>
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
              <div className="channel-name-display">
                {active ? channels.find(c => c.id === active)?.title : "اختر قناة للبدأ"}
              </div>
              <div className="channel-status">
                <div className="status-dot"></div>
                <span>{active ? "جاري التشغيل" : "في انتظار اختيار قناة"}</span>
              </div>
            </div>

            <div className="controls">
              <button className="control-button" onClick={() => {
                const ch = active ? channels.find(c => c.id === active) : channels[0];
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
            </div>
          </div>

          {/* Channels Panel */}
          <div className="channels-panel">
            <div className="panel-header">
              <div className="panel-title">القنوات المتاحة</div>
              <div className="panel-subtitle">اختر قناة للبث المباشر</div>
            </div>

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

            <div className="channels-grid">
              {channels
                .filter(ch => 
                  search === "" || 
                  ch.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((ch) => (
                  <div
                    key={ch.id}
                    className={`channel-item ${active === ch.id ? 'active' : ''}`}
                    onClick={() => playChannel(ch)}
                  >
                    <div className="channel-number">{ch.id}</div>
                    <div className="channel-name">{ch.title}</div>
                    <div className="channel-info">
                      <span className="channel-type">بث مباشر</span>
                      <span>جودة عالية</span>
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
      </main>

      <footer className="footer">
        <div className="footer-logo">MISTER-AI-LIVE</div>
        <div className="footer-text">
          © 2026 MISTERAI LIVE — جميع الحقوق محفوظة — نظام حماية متطور
        </div>
      </footer>
    </>
  );
}
