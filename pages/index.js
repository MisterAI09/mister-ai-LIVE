import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const channels = [
    { id: '1', title: '🟪 1', url: '/api/streams/beinsport1_.m3u8' },
    { id: '2', title: '🟪 2', url: '/api/streams/beinsport2_.m3u8' },
    { id: '3', title: '🟪 3', url: '/api/streams/beinsport3_.m3u8' },
    { id: '4', title: '🟪 4', url: '/api/streams/beinsport4_.m3u8' },
    { id: '5', title: '🟪 5', url: '/api/streams/beinsport5_.m3u8' },
    { id: '6', title: '🟪 6', url: '/api/streams/beinsport6_.m3u8' },
    { id: '7', title: '🟪 7', url: '/api/streams/beinsport7_.m3u8' },
    { id: '8', title: '🟪 8', url: '/api/streams/beinsport8_.m3u8' },
    { id: '9', title: '🟪 9', url: '/api/streams/beinsport9_.m3u8' }
  ];

  const [activeId, setActiveId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // load hls.js client-side
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js';
    s.async = true;
    document.body.appendChild(s);
    return () => {
      document.body.removeChild(s);
    };
  }, []);

  // Starfield canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = [];
    const STAR_COUNT = Math.round((w * h) / 7000); // scale with screen

    function rand(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: rand(0.2, 1.0),       // depth for parallax and brightness
        vy: rand(0.15, 0.8),     // fall speed
        size: rand(0.6, 2.6),
        tw: Math.random() * Math.PI * 2
      });
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    function render(t) {
      ctx.clearRect(0, 0, w, h);
      // subtle gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#000007');
      bgGrad.addColorStop(1, '#000010');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // faint nebula glow at center
      const glow = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)/1.6);
      glow.addColorStop(0, 'rgba(0,50,70,0.15)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // draw stars
      for (let i = 0; i < stars.length; i++) {
        const sObj = stars[i];
        // twinkle
        sObj.tw += 0.02 * sObj.z;
        const twinkle = 0.6 + Math.sin(sObj.tw) * 0.4;

        // fall
        sObj.y += sObj.vy * (1 + sObj.z * 1.5);
        sObj.x += Math.sin(t / 1000 + sObj.z * 5) * 0.2; // tiny sway

        // recycle
        if (sObj.y > h + 20) {
          sObj.y = -10;
          sObj.x = Math.random() * w;
          sObj.vy = rand(0.15, 0.8);
          sObj.size = rand(0.6, 2.6);
          sObj.z = rand(0.2, 1.0);
        }

        // draw glow
        const alpha = (0.4 + sObj.z * 0.6) * twinkle;
        ctx.beginPath();
        const radius = sObj.size * (1 + sObj.z);
        // outer glow
        ctx.fillStyle = `rgba(0,200,255,${alpha * 0.09})`;
        ctx.shadowColor = `rgba(0,160,255,${alpha * 0.35})`;
        ctx.shadowBlur = 12 * sObj.z;
        ctx.arc(sObj.x, sObj.y, radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // core
        ctx.beginPath();
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(140,220,255,${alpha})`;
        ctx.arc(sObj.x, sObj.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // play url helper (HLS)
  function playUrl(channel) {
    setErrorMsg('');
    const video = videoRef.current;
    if (!video) return;
    const url = channel.url;
    setActiveId(channel.id);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      try { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } } catch {}
      video.src = url;
      video.load();
      video.muted = isMuted;
      video.play().catch(() => {});
      return;
    }

    const Hls = window.Hls;
    if (!Hls) {
      setErrorMsg('جارٍ تحميل المشغل... انتظر ثوانٍ وأعد المحاولة');
      return;
    }

    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch {}
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = isMuted;
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (ev, data) => {
        console.error('HLS error', data);
        if (data && data.type === 'networkError') setErrorMsg('خطأ في الشبكة أثناء جلب البث');
      });
    } else {
      setErrorMsg('متصفحك لا يدعم HLS');
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }

  // cleanup HLS on unmount
  useEffect(() => {
    return () => {
      try { if (hlsRef.current) hlsRef.current.destroy(); } catch (e) {}
    };
  }, []);

  return (
    <>
      <Head>
        <title>MisterAI LIVE — تصميم جديد</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          /* ensure body is black and content front */
          :root { --glow: rgba(0,200,255,0.18); --panel-bg: rgba(6,10,18,0.6); }
          body { background: #000; }
          /* luminous frame */
          .glow-frame {
            border-radius: 18px;
            border: 1px solid rgba(0,200,255,0.12);
            box-shadow: 0 8px 40px rgba(0,120,180,0.08), 0 0 48px rgba(0,180,255,0.04) inset;
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          }
          /* subtle frosted glass */
          .glass-panel { background: rgba(255,255,255,0.03); backdrop-filter: blur(8px); }
          /* accent button */
          .accent { background: linear-gradient(90deg,#00f2ff,#00ffa6); color: black; font-weight:800; }
        `}</style>
      </Head>

      {/* background canvas (full-screen) */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <main className="min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold" style={{ background: 'linear-gradient(90deg,#00f2ff,#00ff88,#00f2ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                MISTERAI LIVE
              </h1>
              <p className="text-xs text-gray-300">واجهة عصرية بخلفية متحركة · بث مباشر</p>
            </div>
            <div className="text-xs text-gray-400">مفاتيح: M = كتم</div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* left: channel list */}
            <aside className="lg:col-span-1">
              <div className="glass-panel glow-frame p-4">
                <h3 className="text-cyan-300 font-bold mb-3">قنوات BeIN Sport</h3>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {channels.map((ch) => {
                    const active = activeId === ch.id;
                    return (
                      <div key={ch.id} className={`flex items-center justify-between p-2 rounded-lg ${active ? 'ring-2 ring-cyan-400/30' : 'border border-white/6'} `}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-8 rounded-md flex items-center justify-center font-bold ${active ? 'bg-cyan-400 text-black' : 'bg-violet-600 text-white'}`}>{ch.id}</div>
                          <div>
                            <div className="text-sm font-bold">{ch.title}</div>
                            <div className="text-xs text-gray-400">BeIN Sport</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => playUrl(ch)} className="px-3 py-1 accent rounded-md text-sm">▶ تشغيل</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* right: player & info */}
            <section className="lg:col-span-3">
              <div className="glass-panel glow-frame p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <video ref={videoRef} id="tvPlayer" controls playsInline className="w-full rounded-2xl bg-black h-72 object-cover" />
                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
                        <span className="text-xs text-white/90 font-bold">LIVE</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <button onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setIsMuted(v.muted); } }} className="px-3 py-2 bg-white/6 rounded-lg text-sm"> {isMuted ? 'إلغاء كتم' : 'كتم'} </button>
                      <button onClick={() => { const v = videoRef.current; if (v) { v.currentTime = Math.max(0, v.currentTime - 5); } }} className="px-3 py-2 bg-white/6 rounded-lg text-sm">-5s</button>
                      <button onClick={() => { const v = videoRef.current; if (v) { v.currentTime += 5; } }} className="px-3 py-2 bg-white/6 rounded-lg text-sm">+5s</button>
                      <button onClick={() => { const ch = channels.find(c => c.id === activeId); if (ch) playUrl(ch); }} className="px-3 py-2 accent rounded-lg text-sm">إعادة تحميل</button>
                    </div>

                    {errorMsg && <div className="mt-3 text-sm text-yellow-300">{errorMsg}</div>}
                  </div>

                  <div>
                    <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <h4 className="text-sm font-black text-cyan-300 mb-2">معلومات القناة</h4>
                      <div className="text-xs text-gray-200">
                        {activeId ? (
                          <>
                            <div className="font-bold">قناة {activeId}</div>
                            <div className="mt-1 text-gray-400">مزود: BeIN Sport</div>
                            <div className="mt-2 text-gray-400">جودة: تلقائية عبر HLS</div>
                          </>
                        ) : (
                          <div className="text-gray-500">اختر قناة لبدء البث</div>
                        )}
                      </div>
                      <div className="mt-4">
                        <button onClick={() => { const ch = channels.find(c => c.id === activeId); if (!ch) return alert('اختر قناة'); const popup = window.open('', '_blank', 'width=900,height=600'); popup.document.write(`<title>Popout - Channel ${activeId}</title><body style="margin:0;background:#000;"><video src="${ch.url}" controls autoplay style="width:100%;height:100%;"></video></body>`); }} className="w-full px-3 py-2 bg-violet-600 rounded-lg font-bold">فتح نافذة جديدة</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* notes / footer area */}
              <div className="mt-6 glass-panel glow-frame p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">ملاحظات: إن تعذّر التشغيل قد يكون بسبب رفض مصدر البث أو قيود CORS.</div>
                  <div className="text-xs text-gray-400">مفاتيح مساعدة: M = كتم</div>
                </div>
              </div>
            </section>
          </div>

          {/* copyright footer */}
          <footer className="mt-8 text-center text-xs text-gray-400">
            © 2026 MISTERAI LIVE — جميع الحقوق محفوظة
          </footer>
        </div>
      </main>
    </>
  );
}
