import Head from 'next/head';

export default function Home() {
  const news = [
    'الجزائر تصدر قائمة الدول الأقل أسعاراً للوقود عالمياً',
    'ضربة موجعة لمنتخب الجزائر قبل مواجهة الكونغو الديمقراطية',
    'الجزائر بين أفضل 10 وجهات سياحية عالمية لعام 2026',
    'مسؤول بـ "حماية المستهلك" يعلق: "سبوتنيك" على أجهزة النقل التي تشهدها البلاد',
    'مباراة الجزائر ضد الكونغو الديمقراطية بكأس أمم أفريقيا.. المواعيد والقنوات الناقلة',
    'دولة عربية توقع أسعار الوقود لأول مرة منذ 6 سنوات',
    'بالڤيديو.. "مارادونا" الجزائري يواصل إثارة الجماهير في كأس أفريقيا'
  ];

  return (
    <>
      <Head>
        <title>MISTERAI NETWORK — ركن الحكمة الساخرة</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css" />
        <style>{`
          :root{
            --bg:#060912;
            --panel: rgba(10,14,22,0.6);
            --accent:#00f2c3;
            --accent-2:#00c6ff;
          }
          html,body,#__next{height:100%}
          body{
            font-family: 'Cairo', sans-serif;
            background: linear-gradient(180deg,#020617 0%, #04071a 45%, #020617 100%);
            color: #e6eef6;
            -webkit-font-smoothing:antialiased;
            -moz-osx-font-smoothing:grayscale;
          }
          /* big neon title */
          .glow-title {
            letter-spacing: 0.02em;
            background: linear-gradient(90deg,var(--accent), var(--accent-2));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            font-weight: 900;
          }
          /* subtle inner glow frame */
          .neon-frame {
            border-radius: 22px;
            border: 1px solid rgba(0,198,255,0.08);
            box-shadow: 0 8px 40px rgba(2,8,20,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
            background: linear-gradient(180deg, rgba(255,255,255,0.012), rgba(255,255,255,0.004));
          }
          /* custom scrollbar for news box */
          .thin-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
          .thin-scroll::-webkit-scrollbar-thumb { background: rgba(0,198,255,0.12); border-radius: 10px; }
          /* responsive title sizes */
          @media (min-width:1024px){
            .title-lg { font-size: 6.5rem; line-height: 0.85; }
          }
          @media (max-width:1023px){
            .title-lg { font-size: 3.2rem; line-height: 1; }
          }
        `}</style>
      </Head>

      <main dir="rtl" className="min-h-screen relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="title-lg glow-title">MISTERAI NETWORK</h1>
            <p className="text-[10px] text-cyan-300/70 tracking-widest font-black mt-2">THE SATIRICAL PHILOSOPHER | ركن الحكمة الساخرة</p>
          </header>

          {/* Layout: left content (main), right sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Main area (spans 3 cols on large screens) */}
            <section className="lg:col-span-3 space-y-8">
              {/* Top controls */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <button
                  className="px-6 py-3 rounded-2xl bg-gradient-to-b from-cyan-500 to-cyan-600 text-white font-black shadow-[0_12px_40px_rgba(0,200,255,0.08)] hover:translate-y-[-2px] transition-transform"
                >
                  <span className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6" /></svg> استحضار مقال جديد</span>
                </button>

                <div className="flex items-center gap-3 ml-auto">
                  <div className="text-xs text-gray-400">آخر التحديثات</div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Large rounded content card (quote / AI area) */}
              <div className="neon-frame p-8 rounded-[48px] min-h-[220px]">
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <p className="text-gray-400 italic text-[18px] md:text-[20px] max-w-3xl">
                    "يبدو أن المستر في لحظة صمت فلسفية عميقة.. السحابة الرقمية تمر بمرح..."
                  </p>
                  <button className="mt-6 text-xs text-cyan-300/70 underline">إعادة المحاولة</button>
                </div>
              </div>

              {/* Additional section grid (three columns on large screens) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="neon-frame p-6 rounded-2xl">
                  <h3 className="text-cyan-300 font-black mb-3">تخريفات المستر</h3>
                  <p className="text-sm text-gray-300">مساحة لمقالات المستر الساخرة — هنا يظهر النص الملخّص أو مقتطف من المقال.</p>
                </div>

                <div className="neon-frame p-6 rounded-2xl">
                  <h3 className="text-cyan-300 font-black mb-3">ميزات</h3>
                  <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                    <li>واجهة عصرية ومتجاوبة لكافة الأجهزة</li>
                    <li>خلفية داكنة مع إطار لامع وتأثيرات نيو��</li>
                    <li>قوائم أخبار جانبية مع تمرير نحيف</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Right sidebar (trending / news) */}
            <aside className="lg:col-span-1">
              <div className="neon-frame p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-orange-400 font-black">نبض الجزائر الآن</h4>
                  <span className="text-xs text-gray-400">LIVE</span>
                </div>

                <div className="border-l-2 border-cyan-400/30 pl-4 space-y-3 max-h-[62vh] overflow-y-auto thin-scroll">
                  {news.map((item, idx) => (
                    <div key={idx} className="py-2">
                      <a className="block text-sm text-gray-300 hover:text-white transition">{item}</a>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  تحديث آلي · حقوق النشر © MISTERAI NETWORK 2026
                </div>
              </div>
            </aside>
          </div>

          {/* Footer */}
          <footer className="mt-10 text-center text-xs text-gray-500">
            PROGRAMMING_DNA | MISTERAI_SECURITY | جميع الحقوق محفوظة © 2026
          </footer>
        </div>
      </main>
    </>
  );
}
