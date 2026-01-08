<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>قنوات البث المباشر</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0c2461, #1e3799);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            padding: 30px 0;
            margin-bottom: 40px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            background: linear-gradient(to right, #ff9a00, #ff3c00);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            color: #a5b1c2;
        }
        
        .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .channel-card {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        .channel-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        
        .channel-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .channel-logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-left: 15px;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .channel-info {
            flex: 1;
        }
        
        .channel-name {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 5px;
            color: #fff;
        }
        
        .channel-status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .status-live {
            background: rgba(39, 174, 96, 0.2);
            color: #27ae60;
            border: 1px solid rgba(39, 174, 96, 0.3);
        }
        
        .status-problem {
            background: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
            border: 1px solid rgba(231, 76, 60, 0.3);
        }
        
        .channel-desc {
            color: #bdc3c7;
            margin-bottom: 25px;
            line-height: 1.6;
            font-size: 0.95rem;
        }
        
        .button-container {
            display: flex;
            gap: 12px;
        }
        
        .btn {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-decoration: none;
            color: white;
        }
        
        .btn-browser {
            background: linear-gradient(45deg, #3498db, #2980b9);
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }
        
        .btn-browser:hover {
            background: linear-gradient(45deg, #2980b9, #1f639b);
            transform: scale(1.05);
        }
        
        .btn-external {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }
        
        .btn-external:hover {
            background: linear-gradient(45deg, #c0392b, #a93226);
            transform: scale(1.05);
        }
        
        .btn-icon {
            font-size: 1.2rem;
        }
        
        .notification {
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 20px 25px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.95);
            color: #2c3e50;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: none;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-icon {
            font-size: 1.8rem;
        }
        
        .notification-success {
            border-right: 5px solid #27ae60;
        }
        
        .notification-warning {
            border-right: 5px solid #f39c12;
        }
        
        .notification-error {
            border-right: 5px solid #e74c3c;
        }
        
        footer {
            text-align: center;
            margin-top: 60px;
            padding: 25px;
            color: #7f8c8d;
            font-size: 0.9rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .channels-grid {
                grid-template-columns: 1fr;
            }
            
            h1 {
                font-size: 2.2rem;
            }
            
            .button-container {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎬 قنوات البث المباشر</h1>
            <p class="subtitle">شاهد أفضل القنوات الرياضية والإعلامية مباشرة وبجودة عالية</p>
        </header>
        
        <div class="channels-grid">
            <!-- قناة تعمل بشكل طبيعي -->
            <div class="channel-card">
                <div class="channel-header">
                    <div class="channel-logo">S1</div>
                    <div class="channel-info">
                        <div class="channel-name">belN SPORTS 1</div>
                        <span class="channel-status status-live">● مباشر - يعمل</span>
                    </div>
                </div>
                <p class="channel-desc">القناة الرياضية الرئيسية - بث مباشر بجودة عالية</p>
                <div class="button-container">
                    <button class="btn btn-browser" onclick="openChannel('https://example.com/bein1')">
                        <span class="btn-icon">🌐</span>
                        فتح في المتصفح
                    </button>
                </div>
            </div>
            
            <!-- القناة التي لا تعمل في المتصفح -->
            <div class="channel-card">
                <div class="channel-header">
                    <div class="channel-logo" style="background: linear-gradient(45deg, #e74c3c, #c0392b);">S2</div>
                    <div class="channel-info">
                        <div class="channel-name">belN SPORTS 2 (CA) HD</div>
                        <span class="channel-status status-problem">⚠️ يحتاج مشغل خارجي</span>
                    </div>
                </div>
                <p class="channel-desc">هذه القناة تتطلب تشغيلها في مشغل خارجي لتجربة أفضل</p>
                <div class="button-container">
                    <button class="btn btn-external" onclick="openExternalChannel('https://example.com/bein2-ca-hd')">
                        <span class="btn-icon">🚀</span>
                        فتح في مشغل خارجي
                    </button>
                </div>
            </div>
            
            <!-- قناة إضافية -->
            <div class="channel-card">
                <div class="channel-header">
                    <div class="channel-logo" style="background: linear-gradient(45deg, #9b59b6, #8e44ad);">S3</div>
                    <div class="channel-info">
                        <div class="channel-name">belN SPORTS 3</div>
                        <span class="channel-status status-live">● مباشر - يعمل</span>
                    </div>
                </div>
                <p class="channel-desc">القناة الثالثة - تغطية شاملة للأحداث الرياضية</p>
                <div class="button-container">
                    <button class="btn btn-browser" onclick="openChannel('https://example.com/bein3')">
                        <span class="btn-icon">🌐</span>
                        فتح في المتصفح
                    </button>
                </div>
            </div>
            
            <!-- قناة إضافية أخرى -->
            <div class="channel-card">
                <div class="channel-header">
                    <div class="channel-logo" style="background: linear-gradient(45deg, #1abc9c, #16a085);">S4</div>
                    <div class="channel-info">
                        <div class="channel-name">belN SPORTS 4</div>
                        <span class="channel-status status-live">● مباشر - يعمل</span>
                    </div>
                </div>
                <p class="channel-desc">قناة المباريات الحصرية والمسابقات الدولية</p>
                <div class="button-container">
                    <button class="btn btn-browser" onclick="openChannel('https://example.com/bein4')">
                        <span class="btn-icon">🌐</span>
                        فتح في المتصفح
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <div id="notification" class="notification">
        <span class="notification-icon" id="notificationIcon">📢</span>
        <span id="notificationText">رسالة للمستخدم</span>
    </div>
    
    <footer>
        <p>© 2024 جميع الحقوق محفوظة | تم التصميم لتجربة مشاهدة أفضل</p>
    </footer>
    
    <script>
        // روابط القنوات الحقيقية - يمكنك تعديلها
        const channelLinks = {
            'https://example.com/bein1': 'https://real-link-1.com/stream.m3u8',
            'https://example.com/bein2-ca-hd': 'https://special-external-stream.com/live.m3u8',
            'https://example.com/bein3': 'https://real-link-3.com/stream.m3u8',
            'https://example.com/bein4': 'https://real-link-4.com/stream.m3u8'
        };
        
        // فتح القنوات العادية في المتصفح
        function openChannel(channelKey) {
            const link = channelLinks[channelKey] || channelKey;
            window.open(link, '_blank');
            showNotification('تم فتح القناة في نافذة جديدة', 'success');
        }
        
        // فتح القنوات الخاصة في مشغل خارجي
        function openExternalChannel(channelKey) {
            const link = channelLinks[channelKey] || channelKey;
            
            // محاولة الفتح في VLC
            const vlcLink = `vlc://${link}`;
            window.location.href = vlcLink;
            
            // إذا لم يفتح في VLC خلال ثانيتين، عرض خيارات أخرى
            setTimeout(() => {
                if (confirm('لم يتم فتح المشغل الخارجي تلقائياً.\n\nهل تريد نسخ رابط التشغيل لتشغيله يدوياً في VLC أو أي مشغل آخر؟')) {
                    navigator.clipboard.writeText(link).then(() => {
                        showNotification('تم نسخ رابط التشغيل إلى الحافظة', 'warning');
                        
                        // عرض تعليمات سريعة
                        setTimeout(() => {
                            alert('للتشغيل اليدوي:\n1. افتح برنامج VLC\n2. اضغط على Media ثم Open Network Stream\n3. الصق الرابط (تم نسخه تلقائياً)\n4. اضغط Play');
                        }, 500);
                    });
                }
            }, 2000);
        }
        
        // عرض إشعارات للمستخدم
        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            const notificationIcon = document.getElementById('notificationIcon');
            
            notificationText.textContent = message;
            
            // تغيير النوع والأيقونة
            notification.className = 'notification';
            if (type === 'success') {
                notification.classList.add('notification-success');
                notificationIcon.textContent = '✅';
            } else if (type === 'warning') {
                notification.classList.add('notification-warning');
                notificationIcon.textContent = '⚠️';
            } else if (type === 'error') {
                notification.classList.add('notification-error');
                notificationIcon.textContent = '❌';
            } else {
                notificationIcon.textContent = '📢';
            }
            
            notification.style.display = 'flex';
            
            // إخفاء الإشعار بعد 5 ثواني
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }
        
        // عند تحميل الصفحة، نتحقق من وجود روابط حقيقية
        document.addEventListener('DOMContentLoaded', () => {
            // يمكن إضافة تحميل للروابط من ملف خارجي هنا
            console.log('صفحة القنوات جاهزة للاستخدام');
        });
    </script>
</body>
</html>
