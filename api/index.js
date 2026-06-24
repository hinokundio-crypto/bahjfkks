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
            <title>Proxy Server</title>
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
                    max-width: 800px;
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
                .logo { font-size: 72px; margin-bottom: 16px; display: block; animation: float 3s ease-in-out infinite; position: relative; z-index: 1; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                h1 { font-size: 42px; background: linear-gradient(135deg, #00ff99, #00ccff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; position: relative; z-index: 1; }
                .status { color: #00ff99; font-size: 18px; margin: 16px 0; display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; z-index: 1; }
                .status .dot { width: 10px; height: 10px; background: #00ff99; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; text-align: left; position: relative; z-index: 1; }
                .info-item { background: rgba(255,255,255,0.05); padding: 16px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); transition: 0.3s; }
                .info-item:hover { background: rgba(255,255,255,0.08); border-color: rgba(0,255,153,0.2); }
                .info-item .label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                .info-item .value { color: #00ccff; font-family: monospace; font-size: 14px; margin-top: 6px; display: block; }
                .btn-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 24px; position: relative; z-index: 1; }
                .btn { padding: 14px 36px; border-radius: 50px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s ease; border: none; text-decoration: none; display: inline-block; }
                .btn-primary { background: linear-gradient(135deg, #00ff99, #00ccff); color: #000; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,255,153,0.3); }
                .btn-secondary { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.12); }
                .btn-secondary:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
                .footer { margin-top: 28px; color: #555; font-size: 13px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; position: relative; z-index: 1; }
                .footer code { background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px; font-size: 12px; color: #888; }
                .highlight { color: #00ff99; font-weight: bold; }
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
                .route-examples {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: center;
                    margin: 12px 0;
                }
                .route-examples span {
                    background: rgba(255,255,255,0.05);
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    color: #aaa;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                @media (max-width: 500px) { .info-grid { grid-template-columns: 1fr; } .container { padding: 30px 20px; } h1 { font-size: 30px; } .logo { font-size: 56px; } }
            </style>
        </head>
        <body>
            <div class="container">
                <span class="logo">🚀</span>
                <h1>Proxy Server</h1>
                <div class="status"><span class="dot"></span>Đang hoạt động</div>
                <div class="info-grid">
                    <div class="info-item"><span class="label">Trạng thái</span><span class="value">🟢 Online</span></div>
                    <div class="info-item"><span class="label">Port</span><span class="value">${PORT}</span></div>
                    <div class="info-item"><span class="label">URL mặc định</span><span class="value" style="font-size:11px;">minhtuanxrophim.vercel.app</span></div>
                    <div class="info-item"><span class="label">Routes</span><span class="value">✅ Động + ${fixedRoutes.length} route cố định <span class="popup-badge">POPUP</span></span></div>
                </div>
                <div class="btn-group">
                    <a href="/proxy" class="btn btn-primary" target="_blank">🎬 Mở trang mặc định</a>
                    <a href="/phimhay" class="btn btn-secondary" target="_blank">📺 Phim Hay</a>
                    <button onclick="customUrl()" class="btn btn-secondary">🔗 URL tùy chỉnh</button>
                </div>
                <div style="margin-top:20px;position:relative;z-index:1;">
                    <div style="color:#888;font-size:14px;margin-bottom:10px;">
                        <strong style="color:#00ccff;">🌍 Route động:</strong>
                    </div>
                    <div class="route-examples">
                        <span>/quoc-gia/trung-quoc.trung-quoc</span>
                        <span>/quoc-gia/han-quoc.han-quoc</span>
                        <span>/the-loai/hanh-dong.hanh-dong</span>
                        <span>/the-loai/tinh-cam.tinh-cam</span>
                        <span>/phim/*</span>
                        <span>/xem-phim/*</span>
                    </div>
                    <details>
                        <summary style="color:#00ccff;cursor:pointer;font-size:14px;margin-top:10px;">📋 Route cố định (${fixedRoutes.length})</summary>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:10px;max-height:200px;overflow-y:auto;padding:10px;">
                            ${fixedRoutes.map(route => `
                                <a href="${route}" target="_blank" style="background:rgba(255,255,255,0.05);padding:6px 14px;border-radius:12px;font-size:12px;color:#aaa;text-decoration:none;border:1px solid rgba(255,255,255,0.05);transition:0.3s;">${route}</a>
                            `).join('')}
                        </div>
                    </details>
                </div>
                <div class="footer">
                    <strong>Hướng dẫn:</strong><br>
                    <code>/proxy?url=URL</code> - Lấy nội dung từ URL<br>
                    <code>/quoc-gia/TEN_QUOC_GIA</code> - Xem phim theo quốc gia<br>
                    <code>/the-loai/TEN_THE_LOAI</code> - Xem phim theo thể loại<br>
                    <span class="highlight">✨ Hỗ trợ tất cả quốc gia và thể loại với route động!</span>
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
