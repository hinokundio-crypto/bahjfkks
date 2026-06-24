const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Middleware log
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============ HÀM TẠO POPUP ============
function createPopupHTML(routeName = '') {
    const displayName = routeName ? routeName.replace(/^\//, '').replace(/-/g, ' ').toUpperCase() : 'HỆ THỐNG';
    
    return `
    <div id="proxyPopup" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        animation: popupFadeIn 0.5s ease;
        font-family: 'Segoe UI', Arial, sans-serif;
    ">
        <div style="
            background: linear-gradient(145deg, #1a1a2e, #16213e);
            padding: 40px 50px;
            border-radius: 24px;
            border: 2px solid rgba(0,255,153,0.3);
            box-shadow: 0 20px 60px rgba(0,255,153,0.15), inset 0 1px 0 rgba(255,255,255,0.05);
            text-align: center;
            max-width: 450px;
            width: 90%;
            animation: popupScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle at 30% 50%, rgba(0,255,153,0.03), transparent 60%);
                animation: popupGlow 4s ease-in-out infinite;
                pointer-events: none;
            "></div>
            
            <div style="
                font-size: 60px;
                margin-bottom: 16px;
                display: block;
                animation: popupIcon 2s ease-in-out infinite;
            ">🚀</div>
            
            <div style="
                font-size: 28px;
                font-weight: 800;
                background: linear-gradient(135deg, #00ff99, #00ccff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 8px;
                letter-spacing: 1px;
            ">CODE BY NHK</div>
            
            <div style="
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, #00ff99, #00ccff);
                margin: 12px auto;
                border-radius: 2px;
            "></div>
            
            <div style="
                color: #e0e0e0;
                font-size: 16px;
                line-height: 1.6;
                margin: 16px 0 24px;
            ">
                <span style="color: #00ff99; font-weight: 600;">✨ ${displayName}</span>
                <br>
                <span style="color: #888; font-size: 14px;">Đang tải nội dung...</span>
            </div>
            
            <button onclick="closePopup()" style="
                background: linear-gradient(135deg, #00ff99, #00ccff);
                color: #000;
                border: none;
                padding: 12px 40px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,255,153,0.2);
                position: relative;
                z-index: 1;
                letter-spacing: 0.5px;
            "
            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 30px rgba(0,255,153,0.4)';"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 20px rgba(0,255,153,0.2)';"
            >OK</button>
            
            <div style="
                margin-top: 16px;
                color: #555;
                font-size: 11px;
                letter-spacing: 2px;
                text-transform: uppercase;
            ">© NHK PROXY</div>
        </div>
    </div>
    
    <style>
        @keyframes popupFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes popupScale {
            from { 
                transform: scale(0.8) translateY(20px);
                opacity: 0;
            }
            to { 
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }
        @keyframes popupIcon {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes popupGlow {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(10%, 10%) rotate(5deg); }
        }
        #proxyPopup button {
            animation: popupBtnPulse 2s ease-in-out infinite;
        }
        @keyframes popupBtnPulse {
            0%, 100% { box-shadow: 0 4px 20px rgba(0,255,153,0.2); }
            50% { box-shadow: 0 4px 35px rgba(0,255,153,0.5); }
        }
    </style>
    
    <script>
        function closePopup() {
            const popup = document.getElementById('proxyPopup');
            popup.style.animation = 'popupFadeOut 0.3s ease forwards';
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
        
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes popupFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        \`;
        document.head.appendChild(style);
        
        // Tự động đóng popup sau 5 giây
        setTimeout(() => {
            const popup = document.getElementById('proxyPopup');
            if (popup) {
                popup.style.animation = 'popupFadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (popup.parentNode) popup.remove();
                }, 500);
            }
        }, 5000);
    </script>
    `;
}

// ============ HÀM TẠO POPUP XỊN HƠN (giống mẫu) ============
function createEnhancedPopupHTML(routeName = '') {
    const displayName = routeName ? routeName.replace(/^\//, '').replace(/-/g, ' ').toUpperCase() : 'HỆ THỐNG';
    
    return `
    <div id="proxyPopupEnhanced" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px) saturate(1.4);
        -webkit-backdrop-filter: blur(10px) saturate(1.4);
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        pointer-events: auto;
        padding: 20px;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    ">
        <div style="
            background: linear-gradient(145deg, #1a1a2e, #16213e);
            border-radius: 48px;
            padding: 40px 36px 36px;
            max-width: 520px;
            width: 100%;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06);
            transform: scale(1) translateY(0);
            animation: cardFloat 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            transition: transform 0.3s ease;
            position: relative;
            overflow: hidden;
        ">
            <!-- Hiệu ứng ánh sáng động -->
            <div style="
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle at 30% 40%, rgba(255, 215, 0, 0.08), transparent 60%);
                animation: shimmer 8s infinite alternate;
                pointer-events: none;
            "></div>
            
            <div style="position: relative; z-index: 2; text-align: center; color: #f0f0f5;">
                <!-- Icon -->
                <div style="
                    font-size: 56px;
                    background: linear-gradient(135deg, #f9d976, #f39c12);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    margin-bottom: 12px;
                    display: inline-block;
                    filter: drop-shadow(0 8px 16px rgba(243, 156, 18, 0.3));
                    animation: pulseGlow 2.5s infinite alternate;
                ">
                    <i class="fas fa-film" style="font-style: normal;">🎬</i>
                </div>
                
                <h2 style="
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    background: linear-gradient(to right, #fff, #d4d4f0);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    margin-bottom: 8px;
                    line-height: 1.2;
                ">${displayName}</h2>
                
                <div style="
                    font-size: 16px;
                    font-weight: 400;
                    color: #b0b0d0;
                    margin-bottom: 28px;
                    letter-spacing: 0.2px;
                    opacity: 0.9;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    padding-bottom: 20px;
                ">
                    <i class="fas fa-sparkles" style="color: #f1c40f; margin: 0 6px;">✨</i> 
                    Trải nghiệm ngay 
                    <i class="fas fa-sparkles" style="color: #f1c40f; margin: 0 6px;">✨</i>
                </div>
                
                <!-- Code + TikTok -->
                <div style="
                    background: rgba(255, 255, 255, 0.04);
                    backdrop-filter: blur(4px);
                    border-radius: 32px;
                    padding: 18px 16px;
                    margin-bottom: 28px;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    transition: all 0.2s;
                ">
                    <div style="
                        font-size: 20px;
                        font-weight: 600;
                        color: #f0f0ff;
                        letter-spacing: 0.5px;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        flex-wrap: wrap;
                    ">
                        <i class="fas fa-code" style="color: #f1c40f; font-size: 22px;">💻</i> 
                        <span>Code BY: NHK</span>
                    </div>
                    <a href="https://www.tiktok.com/@hoangg.huyy.nz" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       style="
                           display: flex;
                           align-items: center;
                           justify-content: center;
                           gap: 12px;
                           background: rgba(0, 0, 0, 0.25);
                           padding: 10px 16px;
                           border-radius: 40px;
                           margin-top: 6px;
                           transition: 0.2s;
                           text-decoration: none;
                           color: #fff;
                           font-size: 16px;
                           font-weight: 500;
                           border: 1px solid rgba(255, 255, 255, 0.05);
                           backdrop-filter: blur(2px);
                       "
                       onmouseover="this.style.background='rgba(255, 0, 80, 0.12)'; this.style.borderColor='#ff0050'; this.style.transform='scale(1.02)';"
                       onmouseout="this.style.background='rgba(0, 0, 0, 0.25)'; this.style.borderColor='rgba(255, 255, 255, 0.05)'; this.style.transform='scale(1)';"
                    >
                        <i class="fab fa-tiktok" style="font-size: 28px; color: #ff0050; filter: drop-shadow(0 0 8px rgba(255, 0, 80, 0.3)); transition: 0.2s;">🎵</i>
                        <span><strong style="
                            font-weight: 600;
                            background: linear-gradient(135deg, #ff0050, #ff6b81);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                        ">TikTok</strong> · @hoangg.huyy.nz</span>
                        <i class="fas fa-arrow-right" style="font-size: 14px; opacity: 0.7;">➜</i>
                    </a>
                </div>
                
                <!-- Nút OK -->
                <button onclick="closeEnhancedPopup()" style="
                    background: linear-gradient(135deg, #f1c40f, #f39c12);
                    border: none;
                    padding: 16px 28px;
                    border-radius: 60px;
                    font-size: 20px;
                    font-weight: 700;
                    color: #0a0a12;
                    width: 100%;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 12px 28px rgba(243, 156, 18, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    letter-spacing: 0.3px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(2px);
                    margin-top: 6px;
                "
                onmouseover="this.style.transform='scale(1.03) translateY(-3px)'; this.style.boxShadow='0 20px 40px rgba(243, 156, 18, 0.5)'; this.style.background='linear-gradient(135deg, #f7dc6f, #f1c40f)';"
                onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 12px 28px rgba(243, 156, 18, 0.3)'; this.style.background='linear-gradient(135deg, #f1c40f, #f39c12)';"
                >
                    <i class="fas fa-check-circle" style="font-size: 22px; transition: 0.2s;">✅</i> OK · Vào xem ngay
                </button>
            </div>
        </div>
    </div>
    
    <style>
        @keyframes cardFloat {
            0% { opacity: 0; transform: scale(0.92) translateY(30px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
            0% { transform: translateX(-10%) translateY(-10%); }
            100% { transform: translateX(10%) translateY(10%); }
        }
        @keyframes pulseGlow {
            0% { filter: drop-shadow(0 4px 12px rgba(243, 156, 18, 0.2)); }
            100% { filter: drop-shadow(0 8px 28px rgba(243, 156, 18, 0.6)); }
        }
        @keyframes popupFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    </style>
    
    <script>
        function closeEnhancedPopup() {
            const popup = document.getElementById('proxyPopupEnhanced');
            if (popup) {
                popup.style.animation = 'popupFadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (popup.parentNode) popup.remove();
                }, 500);
            }
        }
        
        // Tự động đóng popup sau 5 giây
        setTimeout(() => {
            const popup = document.getElementById('proxyPopupEnhanced');
            if (popup) {
                popup.style.animation = 'popupFadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (popup.parentNode) popup.remove();
                }, 500);
            }
        }, 5000);
        
        // Bắt sự kiện ESC để đóng popup
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const popup = document.getElementById('proxyPopupEnhanced');
                if (popup) {
                    closeEnhancedPopup();
                }
            }
        });
        
        // Click ra ngoài card để đóng
        document.addEventListener('click', function(e) {
            const popup = document.getElementById('proxyPopupEnhanced');
            if (popup && e.target === popup) {
                closeEnhancedPopup();
            }
        });
        
        console.log('🎬 Phim Hay · Code BY: NHK · TikTok: @hoangg.huyy.nz');
    </script>
    `;
}

// ============ HÀM FETCH HTML ============
async function fetchAndFixHtml(targetUrl, baseUrl = 'https://minhtuanxrophim.vercel.app', routeName = '') {
    const response = await axios.get(targetUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        },
        maxRedirects: 10,
        timeout: 30000,
        httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false
        })
    });

    let html = response.data;
    
    // Sử dụng popup nâng cao
    const popupHTML = createEnhancedPopupHTML(routeName);
    
    const fixScript = `
    <script>
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.supportsFiber = true;
        
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (url.startsWith('/')) {
                url = '${baseUrl}' + url;
            }
            return originalFetch.call(this, url, options);
        };
        
        console.log('✅ Proxy fix applied');
        
        document.addEventListener('DOMContentLoaded', function() {
            ${popupHTML.replace(/<\/script>/g, '<\\/script>')}
        });
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            ${popupHTML.replace(/<\/script>/g, '<\\/script>')}
        }
    </script>
    `;
    
    html = html.replace(/<head>/i, `<head>
        <base href="${baseUrl}/">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600;14..32,700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        ${fixScript}
    `);
    
    html = html.replace(/(src|href|action)="\/(?!\/)/g, `$1="${baseUrl}/`);
    html = html.replace(/(src|href|action)='\/(?!\/)/g, `$1='${baseUrl}/`);
    html = html.replace(/(src|href|action)="\.\//g, `$1="${baseUrl}/`);
    html = html.replace(/(src|href|action)='\.\//g, `$1='${baseUrl}/`);
    
    html = html.replace(/<script type="importmap">/g, `<script type="importmap" crossorigin="anonymous">`);
    html = html.replace(/<script type="module">/g, `<script type="module" crossorigin="anonymous">`);
    html = html.replace(/<script /g, `<script crossorigin="anonymous" `);
    
    return html;
}

// ============ ROUTE PROXY ============
app.get('/proxy', async (req, res) => {
    try {
        let targetUrl = req.query.url;
        if (!targetUrl) {
            targetUrl = 'https://minhtuanxrophim.vercel.app/phimhay';
        }
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        
        console.log(`🔄 Đang lấy: ${targetUrl}`);
        
        const routeName = req.query.url ? new URL(targetUrl).pathname : '/proxy';
        const html = await fetchAndFixHtml(targetUrl, 'https://minhtuanxrophim.vercel.app', routeName);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        
        console.log(`✅ Thành công: ${targetUrl}`);
        res.send(html);

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Lỗi</title></head>
            <body style="font-family:Arial;text-align:center;padding:50px;background:#1a1a1a;color:white;">
                <h1 style="color:#ff6b6b;">⚠️ Lỗi tải trang</h1>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding:10px 30px;background:#00ff99;border:none;border-radius:5px;cursor:pointer;margin-top:20px;">Thử lại</button>
            </body>
            </html>
        `);
    }
});

// ============ ROUTE CHO IMAGES ============
app.get('/images/*', async (req, res) => {
    try {
        const imagePath = req.params[0] || '';
        const targetUrl = `https://minhtuanxrophim.vercel.app/images/${imagePath}`;
        
        console.log(`🖼️ Đang lấy image: ${targetUrl}`);
        
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            responseType: 'stream',
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });
        
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        response.data.pipe(res);
        
    } catch (error) {
        console.error('❌ Lỗi image:', error.message);
        res.status(404).send('Image not found');
    }
});

// ============ ROUTE ĐỘNG CHO QUỐC GIA - FIX ============
app.get('/quoc-gia/:country', async (req, res) => {
    try {
        const countryPath = req.params.country || '';
        const targetUrl = `https://minhtuanxrophim.vercel.app/quoc-gia/${countryPath}`;
        const routeName = `/quoc-gia/${countryPath}`;
        
        console.log(`🌍 Đang lấy quốc gia: ${targetUrl}`);
        
        const html = await fetchAndFixHtml(targetUrl, 'https://minhtuanxrophim.vercel.app', routeName);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(html);

    } catch (error) {
        console.error(`❌ Lỗi quốc gia:`, error.message);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Lỗi</title></head>
            <body style="font-family:Arial;text-align:center;padding:50px;background:#1a1a2e;color:white;">
                <h1 style="color:#ff6b6b;">⚠️ Lỗi tải trang</h1>
                <p>${error.message}</p>
                <p style="color:#888;font-size:14px;">Quốc gia: ${countryPath}</p>
                <button onclick="location.reload()" style="padding:10px 30px;background:#00ff99;border:none;border-radius:5px;cursor:pointer;margin-top:20px;">Thử lại</button>
                <br><br>
                <a href="/" style="color:#00ccff;">Quay lại trang chủ</a>
            </body>
            </html>
        `);
    }
});

// ============ ROUTE ĐỘNG CHO THỂ LOẠI - FIX ============
app.get('/the-loai/:genre', async (req, res) => {
    try {
        const genrePath = req.params.genre || '';
        const targetUrl = `https://minhtuanxrophim.vercel.app/the-loai/${genrePath}`;
        const routeName = `/the-loai/${genrePath}`;
        
        console.log(`🎭 Đang lấy thể loại: ${targetUrl}`);
        
        const html = await fetchAndFixHtml(targetUrl, 'https://minhtuanxrophim.vercel.app', routeName);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(html);

    } catch (error) {
        console.error(`❌ Lỗi thể loại:`, error.message);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Lỗi</title></head>
            <body style="font-family:Arial;text-align:center;padding:50px;background:#1a1a2e;color:white;">
                <h1 style="color:#ff6b6b;">⚠️ Lỗi tải trang</h1>
                <p>${error.message}</p>
                <p style="color:#888;font-size:14px;">Thể loại: ${genrePath}</p>
                <button onclick="location.reload()" style="padding:10px 30px;background:#00ff99;border:none;border-radius:5px;cursor:pointer;margin-top:20px;">Thử lại</button>
                <br><br>
                <a href="/" style="color:#00ccff;">Quay lại trang chủ</a>
            </body>
            </html>
        `);
    }
});

// ============ CÁC ROUTE CỐ ĐỊNH ============
const fixedRoutes = [
    '/phimhay',
    '/phim-le',
    '/phim-bo',
    '/hoi-dap',
    '/chinh-sach-bao-mat',
    '/dieu-khoan-su-dung',
    '/gioi-thieu',
    '/lien-he',
    '/dongphim',
    '/ghienphim',
    '/motphim',
    '/subnhanh',
    '/phim',
    '/the-loai',
    '/quoc-gia',
    '/tim-kiem'
];

fixedRoutes.forEach(route => {
    app.get(route, async (req, res) => {
        try {
            const targetUrl = `https://minhtuanxrophim.vercel.app${route}`;
            console.log(`🎬 Đang lấy: ${targetUrl}`);
            
            const html = await fetchAndFixHtml(targetUrl, 'https://minhtuanxrophim.vercel.app', route);
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('X-Frame-Options', 'ALLOWALL');
            res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(html);

        } catch (error) {
            console.error(`❌ Lỗi route ${route}:`, error.message);
            res.status(500).send(`
                <!DOCTYPE html>
                <html>
                <head><title>Lỗi</title></head>
                <body style="font-family:Arial;text-align:center;padding:50px;background:#1a1a2e;color:white;">
                    <h1 style="color:#ff6b6b;">⚠️ Lỗi tải trang</h1>
                    <p>${error.message}</p>
                    <p style="color:#888;font-size:14px;">Route: ${route}</p>
                    <button onclick="location.reload()" style="padding:10px 30px;background:#00ff99;border:none;border-radius:5px;cursor:pointer;margin-top:20px;">Thử lại</button>
                    <br><br>
                    <a href="/" style="color:#00ccff;">Quay lại trang chủ</a>
                </body>
                </html>
            `);
        }
    });
});

// ============ ROUTE PHIM ============
app.get('/phim/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const targetUrl = `https://minhtuanxrophim.vercel.app/phim/${slug}`;
        const routeName = `/phim/${slug}`;
        
        console.log(`🎬 Đang lấy phim: ${targetUrl}`);
        
        const html = await fetchAndFixHtml(targetUrl, 'https://minhtuanxrophim.vercel.app', routeName);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(html);

    } catch (error) {
        console.error('❌ Lỗi phim:', error.message);
        res.status(500).send(`Lỗi: ${error.message}`);
    }
});

// ============ ROUTE XEM PHIM ============
app.get('/xem-phim/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const targetUrl = `https://minhtuanxrophim.vercel.app/xem-phim/${slug}`;
        const routeName = `/xem-phim/${slug}`;
        
        console.log(`🎬 Đang lấy xem-phim: ${targetUrl}`);
        
        const html = await fetchAndFixHtml(targetUrl, 'https://minhtuanxrophim.vercel.app', routeName);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(html);

    } catch (error) {
        console.error('❌ Lỗi xem-phim:', error.message);
        res.status(500).send(`Lỗi: ${error.message}`);
    }
});

// ============ ROUTE CHO MANIFEST, ROBOTS, SITEMAP ============
app.get('/manifest.json', async (req, res) => {
    try {
        const targetUrl = 'https://minhtuanxrophim.vercel.app/manifest.json';
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0
