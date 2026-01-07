import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const defaultChannels = [
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

  const [channels] = useState(defaultChannels);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load hls.js script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // load favorites from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('misterai_favs') || '[]');
      setFavorites(Array.isArray(stored) ? stored : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('misterai_favs', JSON.stringify(favorites));
  }, [favorites]);

  // helper: play url using hls.js or native
  function playUrl(channel) {
    setErrorMsg('');
    const video = videoRef.current;
    if (!video) return;
    const url = channel.url;

    // mark active
    setActiveId(channel.id);

    // native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      try {
        if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      } catch {}
      video.src = url;
      video.load();
      video.muted = isMuted;
      video.play().catch(() => { /* autoplay blocked */ });
      return;
    }

    // use hls.js
    const Hls = window.Hls;
    if (!Hls) {
      setErrorMsg('جاري تحميل مشغل HLS — حاول مجدداً بعد ثوانٍ.');
      return;
    }

    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch (e) {}
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60 });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = isMuted;
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error', data);
        // show friendly error for network/unavailable streams
        if (data && data.type === 'networkError') setErrorMsg('خطأ في الشبكة عند جلب البث. المحاولة لاحقاً.');
      });
    } else {
      setErrorMsg('متصفحك لا يدعم تشغيل HLS.');
    }
  }

  // toggle favorite
  function toggleFav(id) {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  }

  // filtered channels
  const filtered = channels.filter(c => {
    const q = search.trim();
    if (!q) return true;
    return c.title.includes(q) || c.id.includes(q);
  });

  // controls
  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }

  async function togglePiP() {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (!isPiP) {
        if (document.pictureInPictureEnabled) {
          await v.requestPictureInPicture();
          setIsPiP(true);
        } else {
          setErrorMsg('ميزة صورة داخل صورة غير مدعومة في متصفحك.');
        }
      } else {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          setIsPiP(false);
        }
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('تعذر تفعيل Picture-in-Picture.');
    }
  }

  async function toggleFull() {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (!isFull) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        setIsFull(true);
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        setIsFull(false);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('تعذر تبديل وضع الشاشة الكاملة.');
    }
  }

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'm') toggleMute();
      if (e.key === 'p') togglePiP();
      if (e.key === 'f') toggleFull();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPiP, isFull]);

  // cleanup HLS on unmount
  useEffect(() => {
    return () => {
      try { if (hlsRef.current) hlsRef.current.destroy(); } catch (e) {}
    };
  }, []);

  return (
    <>
      <Head>
        <title>MisterAI LIVE — قنوات المباشر</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          /* small custom tweaks */
          .glass { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); backdrop-filter: blur(8px); }
          .channel-card { transition: transform .12s, box-shadow .12s; }
          .channel-card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(2,6,23,0.6); }
          .pulse-dot { box-shadow: 0 0 0 6px rgba(0,242,255,0.06); animation: ping 1.6s infinite; border-radius: 9999px; }
        `}</style>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#071025] text-[#e6eef6] p-6">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ background: 'linear-gradient(90deg,#00f2ff,#00ff88,#00f2ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              MISTERAI LIVE
            </h1>
            <p className="text-xs text-gray-400 mt-1">تجربة بث مباشرة · اضغط على أي قناة لتشغيلها · مفاتيح: M=كتم، P=PiP، F=ملء الشاشة</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن قناة أو رقم..."
                className="w-full md:w-64 px-3 py-2 rounded-lg bg-transparent border border-white/6 placeholder:text-gray-500 text-sm focus:outline-none"
              />
              <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 text-xs">مسح</button>
            </div>
            <div className="ml-2 flex items-center gap-2">
              <button onClick={() => { setSearch(''); }} className="px-3 py-2 bg-cyan-600 rounded-lg text-xs font-bold">عرض الكل</button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Channels */}
          <aside className="lg:col-span-1">
            <div className="p-4 glass rounded-2xl border border-white/6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-cyan-300">قائمة القنوات</h3>
                <span className="text-xs text-gray-400">{filtered.length} نتائج</span>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {filtered.map((ch) => {
                  const fav = favorites.includes(ch.id);
                  const active = activeId === ch.id;
                  return (
                    <div key={ch.id} className={`channel-card flex items-center justify-between p-2 rounded-xl border ${active ? 'border-cyan-400/40 bg-cyan-800/10' : 'border-white/6'} `}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-8 rounded-md flex items-center justify-center text-sm font-extrabold ${active ? 'bg-cyan-500 text-black' : 'bg-violet-600 text-white'}`}>
                          {ch.id}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{ch.title}</div>
                          <div className="text-xs text-gray-400">BeIN Sport</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playUrl(ch)}
                          className="px-3 py-1 bg-cyan-600 rounded-lg text-xs font-bold hover:opacity-90"
                          title="تشغيل"
                        >
                          ▶ تشغيل
                        </button>

                        <button
                          onClick={() => toggleFav(ch.id)}
                          title={fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                          className={`p-1 rounded-md ${fav ? 'bg-yellow-400 text-black' : 'bg-white/6 text-gray-300'}`}
                        >
                          ★
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <h4 className="text-xs text-gray-400 font-black mb-2">المفضلات</h4>
                <div className="flex flex-wrap gap-2">
                  {favorites.length === 0 && <span className="text-xs text-gray-500">لا توجد مفضلات بعد</span>}
                  {favorites.map(fid => {
                    const ch = channels.find(c => c.id === fid);
                    if (!ch) return null;
                    return (
                      <button key={fid} onClick={() => playUrl(ch)} className="px-3 py-1 bg-white/6 rounded-md text-xs">
                        {ch.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Player + Info */}
          <section className="lg:col-span-3 space-y-6">
            <div className="p-6 glass rounded-3xl border border-white/6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2">
                  <div className="relative">
                    <video id="tvPlayer" ref={videoRef} controls playsInline className="w-full rounded-2xl bg-black h-72 object-cover" />
                    {/* overlay badges */}
                    <div className="absolute left-4 top-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full pulse-dot"></div>
                      <div className="text-xs text-white/90 font-bold">LIVE</div>
                    </div>
                  </div>

                  {/* controls */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button onClick={toggleMute} className="px-3 py-2 bg-white/6 rounded-lg text-sm">{isMuted ? 'إلغاء كتم' : 'كتم M'}</button>
                      <button onClick={togglePiP} className="px-3 py-2 bg-white/6 rounded-lg text-sm">PiP P</button>
                      <button onClick={toggleFull} className="px-3 py-2 bg-white/6 rounded-lg text-sm">ملء F</button>
                      <button onClick={() => {
                        // retry current stream
                        const ch = channels.find(c => c.id === activeId);
                        if (ch) playUrl(ch);
                      }} className="px-3 py-2 bg-cyan-600 rounded-lg text-sm">إعادة تحميل</button>
                    </div>

                    <div className="text-xs text-gray-400">
                      {activeId ? `قناة ${activeId} قيد التشغيل` : 'لم يتم اختيار قناة'}
                    </div>
                  </div>

                  {errorMsg && <div className="mt-3 text-sm text-yellow-300">{errorMsg}</div>}
                </div>

                <div className="md:col-span-1">
                  <div className="p-3 rounded-xl bg-gradient-to-b from-white/2 to-white/3 border border-white/4">
                    <h4 className="text-sm font-black text-cyan-300 mb-2">معلومات القناة</h4>
                    <div className="text-xs text-gray-300 mb-3">
                      {activeId ? (
                        <>
                          <div className="font-bold">القناة: {activeId}</div>
                          <div className="mt-1 text-gray-400">مزود البث: BeIN Sport</div>
                          <div className="mt-2 text-gray-400">الجودة: تلقائية عبر HLS</div>
                        </>
                      ) : (
                        <div className="text-gray-500">اختر قناة من القائمة لتظهر المعلومات هنا.</div>
                      )}
                    </div>

                    <div className="mt-4">
                      <button onClick={() => {
                        // open popout window with the raw stream URL
                        const ch = channels.find(c => c.id === activeId);
                        if (!ch) return alert('اختر قناة أولاً');
                        const popup = window.open('', '_blank', 'width=900,height=600');
                        popup.document.write(`<title>Popout - Channel ${activeId}</title><body style="margin:0;background:#000;"><video src="${ch.url}" controls autoplay style="width:100%;height:100%;"></video></body>`);
                      }} className="w-full px-3 py-2 bg-violet-600 rounded-lg font-bold">فتح في نافذة جديدة</button>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      ملاحظات: إذا تعذّر التشغيل فقد يكون السبب CORS أو رفض من مصدر البث.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional content area */}
            <div className="p-6 glass rounded-2xl border border-white/6">
              <h3 className="text-sm text-gray-300 font-black mb-3">تخريفات المستر — الموجز</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <article className="p-4 rounded-xl bg-white/3">
                  <h4 className="font-bold">مقال تجريبي</h4>
                  <p className="text-sm text-gray-200 mt-2">هذا المكان مخصص لعرض ملخصات أو أخبار متغيرة. اكتب أو اربط API الأخبار لديك لملئه بمحتوى حقيقي.</p>
                </article>
                <article className="p-4 rounded-xl bg-white/3">
                  <h4 className="font-bold">نصائح</h4>
                  <ul className="text-sm text-gray-200 list-disc ml-5 mt-2">
                    <li>M = كتم الصوت، P = Picture-in-Picture، F = كامل الشاشة</li>
                    <li>لأحمال مرتفعة استخدم VPS أو سيرفر مخصص للبث</li>
                  </ul>
                </article>
              </div>
            </div>

          </section>
        </div>

        <footer className="max-w-7xl mx-auto text-center text-xs text-gray-500 mt-10">
          © MISTERAI LIVE — Powered by Vercel & HLS Proxy
        </footer>
      </main>
    </>
  );
}
