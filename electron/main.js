const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Blocked domains list
const BLOCKED_DOMAINS = [
  'reddit.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'facebook.com',
  'tiktok.com',
  'youtube.com',
  'bbc.co.uk/sport',
  'skysports.com'
];

// Generate deterministic block reference from domain
function getBlockRef(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const num = Math.abs(hash % 9000) + 1000;
  return `MER-IT-2024-${num}`;
}

// Get category for blocked domain
function getBlockCategory(domain) {
  if (domain.includes('sport')) return 'News / Sports';
  if (['twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'tiktok.com', 'reddit.com'].includes(domain)) {
    return 'Social Media';
  }
  if (domain === 'youtube.com') return 'Entertainment';
  return 'Restricted Content';
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true, // Enable webview tag
    },
  });

  // Disable default menu
  mainWindow.setMenu(null);

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Set Content Security Policy - updated to allow webview
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https:;"
        ],
      },
    });
  });

  // Set up webRequest filter to block certain domains
  const filter = {
    urls: ['*://*/*']
  };

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    const url = new URL(details.url);
    const hostname = url.hostname.toLowerCase();
    
    // Check if this is a blocked domain
    const isBlocked = BLOCKED_DOMAINS.some(blocked => {
      // Check exact match or subdomain
      return hostname === blocked || 
             hostname.endsWith('.' + blocked) ||
             (blocked.includes('/') && hostname + url.pathname === blocked);
    });
    
    if (isBlocked && details.webContentsId) {
      // Get the blocked domain info
      const blockedDomain = BLOCKED_DOMAINS.find(b => hostname === b || hostname.endsWith('.' + b) || (b.includes('/') && hostname + url.pathname === b)) || hostname;
      
      // Redirect to block page with query params
      const blockPageUrl = `data:text/html;charset=utf-8,${encodeURIComponent(createBlockPage(blockedDomain))}`;
      callback({ redirectURL: blockPageUrl });
      return;
    }
    
    callback({});
  });
}

// Create the block page HTML
function createBlockPage(domain) {
  const ref = getBlockRef(domain);
  const category = getBlockCategory(domain);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Access Denied</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .block-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
      padding: 48px;
      text-align: center;
    }
    .block-icon {
      width: 64px;
      height: 64px;
      background: #d83b01;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 32px;
    }
    .block-title {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16px;
    }
    .block-message {
      font-size: 14px;
      color: #4a4a4a;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .block-details {
      background: #f8f8f8;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 24px;
      text-align: left;
    }
    .block-details-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .block-details-row:last-child {
      margin-bottom: 0;
    }
    .block-details-label {
      color: #717171;
    }
    .block-details-value {
      color: #1a1a1a;
      font-weight: 500;
    }
    .block-btn {
      background: none;
      border: 1px solid #c4c4c4;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      color: #0078d4;
      transition: all 0.2s;
    }
    .block-btn:hover {
      background: #f0f0f0;
    }
    .block-footer {
      margin-top: 24px;
      font-size: 12px;
      color: #717171;
    }
  </style>
</head>
<body>
  <div class="block-container">
    <div class="block-icon">🚫</div>
    <h1 class="block-title">ACCESS DENIED</h1>
    <p class="block-message">
      This website has been blocked by Meridian Analytics IT Security Policy.
    </p>
    <div class="block-details">
      <div class="block-details-row">
        <span class="block-details-label">Category:</span>
        <span class="block-details-value">${category}</span>
      </div>
      <div class="block-details-row">
        <span class="block-details-label">Policy:</span>
        <span class="block-details-value">AUP-7.2 — Restricted Content</span>
      </div>
      <div class="block-details-row">
        <span class="block-details-label">Ref:</span>
        <span class="block-details-value">${ref}</span>
      </div>
    </div>
    <p style="font-size: 13px; color: #4a4a4a; margin-bottom: 16px;">
      If you believe this is an error, raise a ticket with IT Support.<br>
      Response time: 3 business days.
    </p>
    <button class="block-btn" onclick="alert('Ticket submitted. Carl will be in touch within 3 business days.')">
      Report False Positive
    </button>
    <p class="block-footer">
      Meridian Analytics IT Security
    </p>
  </div>
</body>
</html>`;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
