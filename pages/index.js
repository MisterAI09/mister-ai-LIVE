<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MISTER-AI-LIVE - واجهة جديدة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #220404;
            --teal: #00e0d6;
            --teal2: #00bfff;
            --btn-inner: rgba(0, 200, 255, 0.08);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Cairo', sans-serif;
            background: radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.02), transparent 8%), var(--bg);
            color: #eef8f9;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        /* الشريط العلوي */
        .top-bar {
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0, 200, 255, 0.2);
            z-index: 1000;
            backdrop-filter: blur(10px);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--teal), var(--teal2));
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0, 180, 220, 0.3);
        }

        .logo-text {
            font-weight: 900;
            background: linear-gradient(90deg, var(--teal), var(--teal2));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 24px;
        }

        /* المحتوى الرئيسي */
        .main-content {
            max-width: 1400px;
            margin: 100px auto 50px;
            padding: 0 20px;
        }

        /* مشغل الفيديو */
        .player-container {
            background: rgba(0, 0, 0, 0.4);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .video-wrapper {
            position: relative;
            width: 100%;
            height: 500px;
            border-radius: 15px;
            overflow: hidden;
            background: #000;
        }

        .video-wrapper iframe,
        .video-wrapper video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .player-title {
            text-align: center;
            margin-top: 15px;
            color: var(--teal);
            font-size: 18px;
            font-weight: 700;
        }

        /* قائمة القنوات */
        .channels-section {
            margin-top: 40px;
        }

        .section-title {
            font-size: 28px;
            margin-bottom: 25px;
            color: var(--teal);
            text-align: center;
            border-bottom: 2px solid rgba(0, 200, 255, 0.3);
            padding-bottom: 10px;
        }

        .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .channel-card {
            background: linear-gradient(180deg, var(--btn-inner), rgba(0, 0, 0, 0.08));
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 200, 255, 0.15);
            box-shadow: 0 10px 30px rgba(0, 200, 255, 0.05);
        }

        .channel-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 200, 255, 0.15);
            border-color: rgba(0, 255, 210, 0.3);
        }

        .channel-card.active {
            background: linear-gradient(180deg, rgba(0, 230, 210, 0.2), rgba(0, 200, 255, 0.1));
            border-color: var(--teal);
        }

        .channel-number {
            font-size: 32px;
            font-weight: 900;
            color: var(--teal2);
            margin-bottom: 10px;
        }

        .channel-name {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .channel-desc {
            font-size: 13px;
            opacity: 0.8;
            margin-top: 8px;
        }

        /* أزرار التحكم */
        .controls {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }

        .control-btn {
            padding: 12px 30px;
            border-radius: 10px;
            background: rgba(0, 200, 255, 0.15);
            border: 1px solid rgba(0, 200, 255, 0.3);
            color: white;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 16px;
        }

        .control-btn:hover {
            background: rgba(0, 200, 255, 0.25);
            transform: scale(1.05);
        }

        /* الفوتر */
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            color: #9fb8bf;
            font-size: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* رسائل */
        .message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 200, 255, 0.9);
            color: #001217;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 700;
            display: none;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        /* التجاوب */
        @media (max-width: 768px) {
            .channels-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .video-wrapper {
                height: 300px;
            }
            
            .main-content {
                margin-top: 80px;
            }
            
            .logo-text {
                font-size: 18px;
            }
        }

        @media (max-width: 480px) {
            .channels-grid {
                grid-template-columns: 1fr;
            }
            
            .controls {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>

    <!-- الشريط العلوي -->
    <div class="top-bar">
        <div class="logo">
            <div class="logo-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <rect x="1.5" y="4" width="21" height="14" rx="2.2" fill="rgba(255,255,255,0.1)"/>
                    <path d="M9 8L15 12L9 16V8Z" fill="#001217"/>
                </svg>
            </div>
            <div class="logo-text">MISTER-AI-LIVE</div>
        </div>
        <div style="color: var(--teal); font-size: 14px;">بث مباشر 24/7</div>
    </div>

    <!-- المحتوى الرئيسي -->
    <div class="main-content">
        
        <!-- مشغل الفيديو -->
        <div class="player-container">
            <div class="video-wrapper" id="videoContainer">
                <!-- سيتم عرض الفيديو هنا -->
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📺</div>
                        <div>انقر على قناة للبدء</div>
                    </div>
                </div>
            </div>
            <div class="player-title" id="currentChannel">لم يتم اختيار قناة</div>
        </div>

        <!-- أزرار التحكم -->
        <div class="controls">
            <button class="control-btn" onclick="playCurrentChannel()">▶ تشغيل</button>
            <button class="control-btn" onclick="openInNewTab()">📂 فتح في نافذة</button>
            <button class="control-btn" onclick="toggleMute()">🔇 كتم</button>
        </div>

        <!-- قائمة القنوات -->
        <div class="channels-section">
            <h2 class="section-title">القنوات المتاحة</h2>
            <div class="channels-grid" id="channelsList">
                <!-- سيتم إضافة القنوات هنا بالجافاسكريبت -->
            </div>
        </div>

    </div>

    <!-- الفوتر -->
    <div class="footer">
        © 2024 MISTER-AI-LIVE — جميع الحقوق محفوظة<br>
        MisterAI_Security • البث المباشر
    </div>

    <!-- رسالة -->
    <div class="message" id="message"></div>

    <script>
        // روابط القنوات الحقيقية - ضع روابطك هنا
        const channels = [
            { id: 1, name: "BeIN Sport 1", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "القناة الرئيسية" },
            { id: 2, name: "BeIN Sport 2", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "قناة كندا" },
            { id: 3, name: "BeIN Sport 3", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "البطولة الإنجليزية" },
            { id: 4, name: "BeIN Sport 4", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "الدوري الإسباني" },
            { id: 5, name: "BeIN Sport 5", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "الكأس المحلية" },
            { id: 6, name: "BeIN Sport 6", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "النهائيات الأوروبية" },
            { id: 7, name: "BeIN Sport 7", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "قناة الرياضات الأمريكية" },
            { id: 8, name: "BeIN Sport 8", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "البث المباشر 24/7" },
            { id: 9, name: "BeIN Sport 9", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", desc: "القناة الاحتياطية" }
        ];

        let currentChannel = null;
        let isMuted = false;
        let videoElement = null;

        // تهيئة القنوات
        function initChannels() {
            const container = document.getElementById('channelsList');
            container.innerHTML = '';
            
            channels.forEach(channel => {
                const card = document.createElement('div');
                card.className = 'channel-card';
                card.innerHTML = `
                    <div class="channel-number">${channel.id}</div>
                    <div class="channel-name">${channel.name}</div>
                    <div class="channel-desc">${channel.desc}</div>
                `;
                
                card.onclick = () => selectChannel(channel);
                container.appendChild(card);
            });
        }

        // اختيار قناة
        function selectChannel(channel) {
            currentChannel = channel;
            
            // تحديث التحديد البصري
            document.querySelectorAll('.channel-card').forEach(card => {
                card.classList.remove('active');
            });
            event.currentTarget.classList.add('active');
            
            // تحديث العنوان
            document.getElementById('currentChannel').textContent = `القناة النشطة: ${channel.name}`;
            
            // عرض رسالة
            showMessage(`تم اختيار ${channel.name}`);
        }

        // تشغيل القناة الحالية
        function playCurrentChannel() {
            if (!currentChannel) {
                showMessage('الرجاء اختيار قناة أولاً');
                return;
            }
            
            const videoContainer = document.getElementById('videoContainer');
            
            // إنشاء عنصر فيديو جديد
            if (videoElement) {
                videoElement.remove();
            }
            
            videoElement = document.createElement('video');
            videoElement.src = currentChannel.url;
            videoElement.controls = true;
            videoElement.autoplay = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'contain';
            videoElement.muted = isMuted;
            
            videoContainer.innerHTML = '';
            videoContainer.appendChild(videoElement);
            
            showMessage(`جاري تشغيل ${currentChannel.name}...`);
        }

        // فتح في نافذة جديدة
        function openInNewTab() {
            if (!currentChannel) {
                showMessage('الرجاء اختيار قناة أولاً');
                return;
            }
            
            window.open(currentChannel.url, '_blank', 'width=1000,height=600');
            showMessage(`فتح ${currentChannel.name} في نافذة جديدة`);
        }

        // كتم الصوت
        function toggleMute() {
            if (videoElement) {
                isMuted = !isMuted;
                videoElement.muted = isMuted;
                showMessage(isMuted ? 'تم كتم الصوت' : 'تم إلغاء الكتم');
            } else {
                showMessage('لا يوجد فيديو نشط');
            }
        }

        // عرض رسالة
        function showMessage(text) {
            const messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        }

        // تهيئة الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            initChannels();
            
            // اختيار القناة الأولى تلقائياً
            if (channels.length > 0) {
                setTimeout(() => {
                    const firstCard = document.querySelector('.channel-card');
                    if (firstCard) {
                        firstCard.click();
                    }
                }, 500);
            }
        });
    </script>

</body>
</html>
