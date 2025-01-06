// 追蹤滑鼠位置
window.mouseX = 0;
window.mouseY = 0;
document.addEventListener('mousemove', (e) => {
  window.mouseX = e.pageX;
  window.mouseY = e.pageY;
});

// 檢測系統深色模式
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// 定義深淺色模式的顏色方案
const theme = {
  light: {
    background: '#ffffff',
    text: '#333333',
    secondaryText: '#666666',
    border: '#eeeeee',
    shadow: 'rgba(0,0,0,0.15)',
    divider: '#dddddd'
  },
  dark: {
    background: '#2d2d2d',
    text: '#ffffff',
    secondaryText: '#b0b0b0',
    border: '#404040',
    shadow: 'rgba(0,0,0,0.3)',
    divider: '#404040'
  }
};

// 獲取當前主題
const currentTheme = isDarkMode ? theme.dark : theme.light;

// 創建浮動視窗
function createFloatingWindow(text, x, y) {
  // 移除舊的浮動視窗（如果存在）
  const oldPopup = document.querySelector('.currency-converter-popup');
  if (oldPopup) {
    oldPopup.remove();
  }

  const div = document.createElement('div');
  div.className = 'currency-converter-popup';
  div.style.position = 'fixed';
  div.style.left = `${x + 10}px`;
  div.style.top = `${y + 10}px`;
  div.style.backgroundColor = currentTheme.background;
  div.style.border = 'none';
  div.style.padding = '10px 15px';
  div.style.borderRadius = '8px';
  div.style.zIndex = '10000';
  div.style.boxShadow = `0 4px 12px ${currentTheme.shadow}`;
  div.style.transition = 'all 0.2s ease';
  div.style.opacity = '0';
  div.style.transform = 'translateY(10px)';
  div.style.fontSize = '14px';
  div.style.fontFamily = 'Arial, sans-serif';
  div.style.color = currentTheme.text;
  div.style.minWidth = '300px';
  div.style.maxWidth = '500px';
  div.style.wordBreak = 'break-word';

  // 添加關閉按鈕
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '8px';
  closeButton.style.top = '5px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '16px';
  closeButton.style.color = currentTheme.secondaryText;
  closeButton.style.padding = '0 5px';
  closeButton.style.transition = 'color 0.2s ease';
  // 滑鼠懸停效果
  closeButton.onmouseover = () => closeButton.style.color = currentTheme.text;
  closeButton.onmouseout = () => closeButton.style.color = currentTheme.secondaryText;
  closeButton.onclick = () => div.remove();

  // 創建內容容器
  const content = document.createElement('div');
  content.innerHTML = text.replace(/\n/g, '<br>');
  content.style.marginRight = '15px';
  content.style.lineHeight = '1.3';
  content.style.whiteSpace = 'nowrap';

  // 為第一行添加特殊樣式
  const lines = content.innerHTML.split('<br>');
  if (lines.length > 0) {
    // 匯率顯示
    lines[0] = `<div style="
      color: ${currentTheme.text};
      font-size: 14px;
      margin-bottom: 1px;
    ">${lines[0]}</div>`;
    
    // 分隔線
    if (lines[1] && lines[1].includes('───────────')) {
      lines[1] = `<div style="
        color: ${currentTheme.divider};
        margin-bottom: 1px;
      ">${lines[1]}</div>`;
    }
    
    // 找到中文數字的起始位置（USD: 或 TWD: 開頭的行）
    const chineseStartIndex = lines.findIndex(line => /^[A-Z]{3}:/.test(line));
    if (chineseStartIndex !== -1) {
      // 為所有行添加統一的樣式
      for (let i = 2; i < lines.length; i++) {
        lines[i] = `<div style="
          color: ${currentTheme.secondaryText};
          font-size: 13px;
          margin-top: 1px;
        ">${lines[i]}</div>`;
      }
    }
    
    content.innerHTML = lines.join('');
  }

  div.appendChild(closeButton);
  div.appendChild(content);
  document.body.appendChild(div);

  // 確保視窗不會超出螢幕範圍
  const rect = div.getBoundingClientRect();
  if (rect.width < 300) {
    div.style.width = '300px';
  }
  if (rect.width > 500) {
    div.style.width = '500px';
  }
  if (rect.right > window.innerWidth) {
    div.style.left = `${window.innerWidth - rect.width - 10}px`;
  }
  if (rect.bottom > window.innerHeight) {
    div.style.top = `${window.innerHeight - rect.height - 10}px`;
  }

  // 添加動畫效果
  requestAnimationFrame(() => {
    div.style.opacity = '1';
    div.style.transform = 'translateY(0)';
  });
}

// 監聽來自背景腳本的訊息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'showResult' || message.type === 'showError') {
    const x = message.mouseX || window.mouseX || 0;
    const y = message.mouseY || window.mouseY || 0;
    createFloatingWindow(message.text, x, y);
  }
}); 