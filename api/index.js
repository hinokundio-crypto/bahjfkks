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
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(12px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        animation: popupFadeIn 0.6s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    ">
        <div style="
            background: linear-gradient(145deg, #0f0f1a, #1a1a2e);
            padding: 45px 50px;
            border-radius: 28px;
            border: 2px solid rgba(0,255,153,0.25);
            box-shadow: 0 25px 70px rgba(0,255,153,0.12), inset 0 1px 0 rgba(255,255,255,0.05);
            text-align: center;
            max-width: 460px;
            width: 92%;
            animation: popupScale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        ">
            <!-- Background glow -->
            <div style="
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle at 30% 50%, rgba(0,255,153,0.04), transparent 60%);
                animation: popupGlow 5s ease-in-out infinite;
                pointer-events: none;
            "></div>
            
            <!-- Icon -->
            <div style="
                font-size: 65px;
                margin-bottom: 12px;
                display: block;
                animation: popupIcon 2.5s ease-in-out infinite;
                position: relative;
                z-index: 1;
            ">🚀</div>
            
            <!-- Tiêu đề chính -->
            <div style="
                font-size: 30px;
                font-weight: 800;
                background: linear-gradient(135deg, #00ff99, #00ccff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 4px;
                letter-spacing: 1.5px;
                position: relative;
                z-index: 1;
            ">CODE BY NHK</div>
            
            <!-- Divider -->
            <div style="
                width: 70px;
                height: 3px;
                background: linear-gradient(90deg, #00ff99, #00ccff);
                margin: 10px auto 14px;
                border-radius: 3px;
                position: relative;
                z-index: 1;
            "></div>
            
            <!-- TikTok với link -->
            <div style="
                color: #e0e0e0;
                font-size: 17px;
                line-height: 1.7;
                margin: 8px 0 20px;
                position: relative;
                z-index: 1;
            ">
                <span style="color: #00ff99; font-weight: 600;">✨ ${displayName}</span>
                <br>
                <a href="https://www.tiktok.com/@hoangg.huyy.nz" 
                   target="_blank" 
                   style="
                       color: #ff0050;
                       text-decoration: none;
                       font-weight: 700;
                       font-size: 19px;
                       transition: all 0.3s ease;
                       display: inline-block;
                       margin-top: 4px;
                   "
                   onmouseover="this.style.color='#ff3385'; this.style.transform='scale(1.05)';"
                   onmouseout="this.style.color='#ff0050'; this.style.transform='scale(1)';"
                >
                    📱 TikTok: @hoangg.huyy.nz
                </a>
                <br>
                <span style="color: #888; font-size: 13px; display: block; margin-top: 4px;">Đang tải nội dung...</span>
            </div>
            
            <!-- Nút OK -->
            <button onclick="closePopup()" style="
                background: linear-gradient(135deg, #00ff99, #00ccff);
                color: #000;
                border: none;
                padding: 13px 45px;
                border-radius: 50px;
                font-size: 17px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 25px rgba(0,255,153,0.25);
                position: relative;
                z-index: 1;
                letter-spacing: 0.5px;
            "
            onmouseover="this.style.transform='scale(1.06)'; this.style.boxShadow='0 8px 35px rgba(0,255,153,0.45)';"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 25px rgba(0,255,153,0.25)';"
            >OK</button>
            
            <!-- Footer -->
            <div style="
                margin-top: 18px;
                color: #444;
                font-size: 11px;
                letter-spacing: 2.5px;
                text-transform: uppercase;
                position: relative;
                z-index: 1;
            ">© NHK PROXY 2026</div>
        </div>
    </div>
    
    <style>
        @keyframes popupFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes popupScale {
            from { 
                transform: scale(0.7) translateY(30px);
                opacity: 0;
            }
            to { 
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }
        @keyframes popupIcon {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-10px) rotate(6deg) scale(1.05); }
        }
        @keyframes popupGlow {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(8%, 8%) rotate(4deg); }
        }
        #proxyPopup button {
            animation: popupBtnPulse 2.5s ease-in-out infinite;
        }
        @keyframes popupBtnPulse {
            0%, 100% { box-shadow: 0 4px 25px rgba(0,255,153,0.25); }
            50% { box-shadow: 0 4px 40px rgba(0,255,153,0.5); }
        }
        /* Animation fade out */
        @keyframes popupFadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
        .popup-fade-out {
            animation: popupFadeOut 0.4s ease forwards !important;
        }
    </style>
    
    <script>
        function closePopup() {
            const popup = document.getElementById('proxyPopup');
            if (popup) {
                popup.classList.add('popup-fade-out');
                setTimeout(() => {
                    if (popup.parentNode) popup.remove();
                }, 400);
            }
        }
        
        // Tự động đóng sau 6 giây
        setTimeout(() => {
            const popup = document.getElementById('proxyPopup');
            if (popup) {
                popup.classList.add('popup-fade-out');
                setTimeout(() => {
                    if (popup.parentNode) popup.remove();
                }, 400);
            }
        }, 6000);
        
        // Đóng khi click ra ngoài
        document.addEventListener('click', function(e) {
            const popup = document.getElementById('proxyPopup');
            if (popup && e.target === popup) {
                closePopup();
            }
        });
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
    const popupHTML = createPopupHTML(routeName);
    
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
        
        function showPopup() {
            ${popupHTML.replace(/<\/script>/g, '<\\/script>').replace(/\\/g, '\\\\')}
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            showPopup();
        });
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(showPopup, 100);
        }
        
        // Fix cho trang load nhanh
        if (document.readyState === 'loading') {
            document.addEventListener('readystatechange', function() {
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    setTimeout(showPopup, 100);
                }
            });
        }
    </script>
    `;
    
    html = html.replace(/<head>/i, `<head>
        <base href="${baseUrl}/">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

// ============ ROUTE ĐỘNG CHO QUỐC GIA ============
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

// ============ ROUTE ĐỘNG CHO THỂ LOẠI ============
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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(response.data);
    } catch (error) {
        res.status(404).send('Manifest not found');
    }
});

app.get('/robots.txt', async (req, res) => {
    try {
        const targetUrl = 'https://minhtuanxrophim.vercel.app/robots.txt';
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });
        res.setHeader('Content-Type', 'text/plain');
        res.send(response.data);
    } catch (error) {
        res.status(404).send('robots.txt not found');
    }
});

app.get('/sitemap.xml', async (req, res) => {
    try {
        const targetUrl = 'https://minhtuanxrophim.vercel.app/sitemap.xml';
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });
        res.setHeader('Content-Type', 'application/xml');
        res.send(response.data);
    } catch (error) {
        res.status(404).send('sitemap.xml not found');
    }
});

// ============ TRANG CHỦ ============
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CODE BY NHK</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin:0; padding:0; box-sizing:border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    color: white;
                    padding: 20px;
                }
                .container {
                    text-align: center;
                    padding: 50px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.08);
                    max-width: 500px;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at 30% 50%, rgba(0,255,153,0.03), transparent 60%);
                    animation: bgGlow 8s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes bgGlow {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(5%, 5%) rotate(3deg); }
                }
                .logo { 
                    font-size: 72px; 
                    margin-bottom: 16px; 
                    display: block; 
                    animation: float 3s ease-in-out infinite; 
                    position: relative; 
                    z-index: 1; 
                }
                @keyframes float { 
                    0%, 100% { transform: translateY(0); } 
                    50% { transform: translateY(-10px); } 
                }
                h1 { 
                    font-size: 42px; 
                    background: linear-gradient(135deg, #00ff99, #00ccff); 
                    -webkit-background-clip: text; 
                    -webkit-text-fill-color: transparent; 
                    margin-bottom: 12px; 
                    position: relative; 
                    z-index: 1; 
                }
                .status { 
                    color: #00ff99; 
                    font-size: 18px; 
                    margin: 16px 0; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    position: relative; 
                    z-index: 1; 
                }
                .status .dot { 
                    width: 10px; 
                    height: 10px; 
                    background: #00ff99; 
                    border-radius: 50%; 
                    display: inline-block; 
                    animation: pulse 2s infinite; 
                }
                @keyframes pulse { 
                    0%, 100% { opacity: 1; } 
                    50% { opacity: 0.3; } 
                }
                .info-grid { 
                    display: grid; 
                    grid-template-columns: 1fr; 
                    gap: 12px; 
                    margin: 24px 0; 
                    text-align: left; 
                    position: relative; 
                    z-index: 1; 
                }
                .info-item { 
                    background: rgba(255,255,255,0.05); 
                    padding: 16px 20px; 
                    border-radius: 12px; 
                    border: 1px solid rgba(255,255,255,0.06); 
                    transition: 0.3s; 
                    text-align: center;
                }
                .info-item:hover { 
                    background: rgba(255,255,255,0.08); 
                    border-color: rgba(0,255,153,0.2); 
                }
                .info-item .label { 
                    color: #888; 
                    font-size: 12px; 
                    text-transform: uppercase; 
                    letter-spacing: 1px; 
                }
                .info-item .value { 
                    color: #00ccff; 
                    font-family: monospace; 
                    font-size: 16px; 
                    margin-top: 6px; 
                    display: block; 
                }
                .btn-group { 
                    display: flex; 
                    gap: 12px; 
                    justify-content: center; 
                    flex-wrap: wrap; 
                    margin-top: 24px; 
                    position: relative; 
                    z-index: 1; 
                }
                .btn { 
                    padding: 14px 36px; 
                    border-radius: 50px; 
                    font-weight: 600; 
                    font-size: 15px; 
                    cursor: pointer; 
                    transition: all 0.3s ease; 
                    border: none; 
                    text-decoration: none; 
                    display: inline-block; 
                }
                .btn-primary { 
                    background: linear-gradient(135deg, #00ff99, #00ccff); 
                    color: #000; 
                }
                .btn-primary:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 8px 30px rgba(0,255,153,0.3); 
                }
                .btn-secondary { 
                    background: rgba(255,255,255,0.08); 
                    color: #fff; 
                    border: 1px solid rgba(255,255,255,0.12); 
                }
                .btn-secondary:hover { 
                    background: rgba(255,255,255,0.15); 
                    transform: translateY(-2px); 
                }
                .footer { 
                    margin-top: 28px; 
                    color: #555; 
                    font-size: 13px; 
                    border-top: 1px solid rgba(255,255,255,0.05); 
                    padding-top: 20px; 
                    position: relative; 
                    z-index: 1; 
                }
                .tiktok-link {
                    display: inline-block;
                    margin-top: 8px;
                    padding: 8px 20px;
                    background: linear-gradient(135deg, #00f2ea, #ff0050);
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                .tiktok-link:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 20px rgba(255, 0, 80, 0.3);
                }
                .highlight { 
                    color: #00ff99; 
                    font-weight: bold; 
                }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
                ::-webkit-scrollbar-thumb { background: #00ff99; border-radius: 10px; }
                .popup-badge {
                    display: inline-block;
                    background: linear-gradient(135deg, #00ff99, #00ccff);
                    color: #000;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    margin-left: 8px;
                }
                @media (max-width: 500px) { 
                    .container { padding: 30px 20px; } 
                    h1 { font-size: 30px; } 
                    .logo { font-size: 56px; } 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <span class="logo">🚀</span>
                <h1>CODE BY NHK</h1>
                <div class="status">
                    <span class="dot"></span>
                    Online
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Trạng thái</span>
                        <span class="value">🟢 Đang hoạt động</span>
                    </div>
                    <div class="info-item">
                        <span class="label">TIKTOK</span>
                        <span class="value">
                            <a href="https://www.tiktok.com/@hoangg.huyy.nz" 
                               target="_blank" 
                               class="tiktok-link"
                               onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 20px rgba(255,0,80,0.4)';"
                               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
                                @hoangg.huyy.nz
                            </a>
                        </span>
                    </div>
                </div>
                <div class="btn-group">
                    <a href="/proxy" class="btn btn-primary" target="_blank">🎬 Mở trang mặc định</a>
                    <button onclick="customUrl()" class="btn btn-secondary">🔗 URL tùy chỉnh</button>
                </div>
                <div class="footer">
                    <span class="highlight">✨ Proxy Server</span>
                    <br>
                    <span style="color: #666; font-size: 12px;">© NHK Proxy</span>
                </div>
            </div>
            <script>
                function customUrl() {
                    const url = prompt('Nhập URL cần lấy:', 'https://minhtuanxrophim.vercel.app/phimhay');
                    if (url) { window.open('/proxy?url=' + encodeURIComponent(url), '_blank'); }
                }
            </script>
        </body>
        </html>
    `);
});

// ============ 404 ============
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>404</title></head>
        <body style="font-family:Arial;text-align:center;padding:50px;background:#1a1a2e;color:white;">
            <h1 style="color:#ff6b6b;">404 - Không tìm thấy</h1>
            <p>Đường dẫn "${req.url}" không tồn tại.</p>
            <p style="color:#888;font-size:14px;margin-top:10px;">
                <strong style="color:#00ff99;">Các route hợp lệ:</strong>
                <br>
                <span style="color:#00ccff;">/quoc-gia/[tên quốc gia]</span>
                <br>
                <span style="color:#00ccff;">/the-loai/[tên thể loại]</span>
                <br>
                <span style="color:#ff6b6b;">/phim/[slug]</span>
                <br>
                <span style="color:#ffd93d;">/xem-phim/[slug]</span>
            </p>
            <a href="/" style="color:#00ff99;">Quay lại trang chủ</a>
        </body>
        </html>
    `);
});

// ============ EXPORT CHO VERCEL ============
module.exports = app;
