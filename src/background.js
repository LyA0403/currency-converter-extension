// 創建右鍵選單
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertCurrency",
    title: "轉換匯率",
    contexts: ["selection"]
  });
});

// 處理數字格式
function parseNumber(text) {
  // 轉換為大寫以統一處理
  const upperText = text.trim().toUpperCase();

  // 檢查原始文字是否包含 M 或 B
  const hasMB = upperText.endsWith('M') || upperText.endsWith('B') || upperText.endsWith('T');

  // 檢查是否包含 M 或 B
  let multiplier = 1;
  if (upperText.endsWith('M')) {
    multiplier = 1000000;
    text = upperText.slice(0, -1);
  } else if (upperText.endsWith('B')) {
    multiplier = 1000000000;
    text = upperText.slice(0, -1);
  } else if (upperText.endsWith('T')) {
    multiplier = 1000000000000;
    text = upperText.slice(0, -1);
  }

  // 移除所有非數字字符，保留小數點和負號
  const cleanText = text.replace(/[^\d.-]/g, '');
  const number = parseFloat(cleanText);
  return {
    value: number * multiplier,
    hasMB: hasMB
  };
}

// 將數字轉換為中文格式
function numberToChinese(num) {
  // 如果數字太小（小於0.01）或太大，不顯示中文轉換
  if (Math.abs(num) < 0.01) {
    return '';
  }

  const units = ['', '萬', '億', '兆', '京'];
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const positions = ['', '十', '百', '千'];
  
  // 處理小數部分
  function processDecimal(decimal) {
    if (!decimal) return '';
    // 取小數點後兩位
    const decimalStr = decimal.toFixed(2).slice(2);
    let result = '';
    // 檢查小數部分是否全為0
    if (parseFloat('0.' + decimalStr) === 0) {
      return '';
    }
    for (let i = 0; i < decimalStr.length; i++) {
      const digit = parseInt(decimalStr[i]);
      if (digit !== 0) {
        result += digits[digit];
      }
    }
    return result ? `「點」${result}` : '';  // 使用特殊符號包住"點"字
  }
  
  // 處理小於 10000 的數字
  function processSection(n) {
    const str = Math.floor(n).toString();
    let result = '';
    let zero = false;
    
    for (let i = 0; i < str.length; i++) {
      const digit = parseInt(str[i]);
      if (digit === 0) {
        zero = true;
      } else {
        if (zero) {
          result += '零';
          zero = false;
        }
        result += digits[digit] + positions[str.length - 1 - i];
      }
    }
    
    // 處理特殊情況
    if (result.startsWith('一十')) {
      result = result.slice(1);
    }
    return result || '零';
  }
  
  // 主要轉換邏輯
  let result = '';
  const absNum = Math.abs(num);
  const integerPart = Math.floor(absNum);
  const decimalPart = absNum - integerPart;
  let remaining = integerPart;
  let unitIndex = 0;
  
  do {
    const section = remaining % 10000;
    remaining = Math.floor(remaining / 10000);
    
    if (section !== 0) {
      result = processSection(section) + units[unitIndex] + result;
    } else if (unitIndex > 0 && remaining > 0) {
      result = units[unitIndex] + result;
    }
    
    unitIndex++;
  } while (remaining > 0);
  
  // 如果整數部分為0，且有小數
  if (result === '' && decimalPart > 0) {
    result = '零';
  }
  
  // 添加小數部分
  if (decimalPart > 0.000001) {  // 使用更小的閾值來避免浮點數精度問題
    result += processDecimal(decimalPart);
  }
  
  return num < 0 ? '負' + result : result;
}

// 格式化數字（不帶小數點）
function formatNumberWithoutDecimals(number) {
  // 處理精度問題，移除小數部分
  number = Math.round(number);
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(number);
}

// 格式化數字（帶小數點）
function formatNumberWithDecimals(number) {
  // 根據數字大小決定顯示的小數位數
  const absNum = Math.abs(number);
  const decimals = absNum < 0.01 ? 8 : 2;
  
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(number);
}

// 格式化數字
function formatNumber(number, useMBFormat = false) {
  // 完整數字格式（移除不必要的小數點）
  const fullFormat = formatNumberWithoutDecimals(number);
  const chineseFormat = numberToChinese(number);
  
  // 判斷是否需要使用 M 或 B 格式
  function getShortFormat(num) {
    if (!useMBFormat) {
      return formatNumberWithDecimals(num);
    }
    
    if (Math.abs(num) >= 1000000000000) {
      return new Intl.NumberFormat('zh-TW', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(num / 1000000000000) + 'T';
    } else if (Math.abs(num) >= 1000000000) {
      return new Intl.NumberFormat('zh-TW', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(num / 1000000000) + 'B';
    } else if (Math.abs(num) >= 1000000) {
      return new Intl.NumberFormat('zh-TW', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(num / 1000000) + 'M';
    }
    return formatNumberWithDecimals(num);
  }
  
  return { 
    short: getShortFormat(number),
    full: useMBFormat ? fullFormat : getShortFormat(number),
    chinese: chineseFormat
  };
}

// 格式化匯率顯示
function formatRate(rate) {
  // 根據匯率大小決定顯示的小數位數
  const decimals = rate < 0.01 ? 8 : 2;
  
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(rate);
}

// 匯率緩存
const rateCache = {
  data: {},
  timestamp: {},
  CACHE_DURATION: 6 * 60 * 60 * 1000  // 6小時緩存
};

// 獲取匯率數據（帶緩存）
async function getExchangeRate(fromCurrency) {
  const now = Date.now();
  
  // 檢查緩存是否有效
  if (rateCache.data[fromCurrency] && 
      rateCache.timestamp[fromCurrency] && 
      now - rateCache.timestamp[fromCurrency] < rateCache.CACHE_DURATION) {
    return rateCache.data[fromCurrency];
  }
  
  // 獲取新數據
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  async function tryFetch() {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      
      if (!data.rates) {
        throw new Error('獲取匯率失敗');
      }
      
      // 更新緩存
      rateCache.data[fromCurrency] = {
        rates: data.rates,
        timestamp: Date.now()  // 使用當前時間
      };
      rateCache.timestamp[fromCurrency] = now;
      
      return rateCache.data[fromCurrency];
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return tryFetch();
      }
      throw error;
    }
  }
  
  return tryFetch();
}

// 處理數字轉換
async function handleConversion(selectedText, tab, x, y) {
  const { value: number, hasMB } = parseNumber(selectedText);

  if (!isNaN(number)) {
    chrome.storage.sync.get(['fromCurrency', 'toCurrency'], async function(data) {
      // 檢查是否有設定貨幣
      if (!data.fromCurrency || !data.toCurrency) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'showError',
          text: '請先在插件設定中選擇貨幣',
          mouseX: x,
          mouseY: y
        });
        return;
      }

      try {
        const rateData = await getExchangeRate(data.fromCurrency);
        const rate = rateData.rates[data.toCurrency];
        const lastUpdated = new Date(rateData.timestamp * 1000);
        
        const convertedAmount = Math.round(number * rate * 100) / 100;
        
        const baseRate = formatRate(rate);
        const originalFormatted = formatNumber(number, hasMB);
        const convertedFormatted = formatNumber(convertedAmount, hasMB);
        const text = `1 ${data.fromCurrency} = ${baseRate} ${data.toCurrency}\n` +
                    `───────────────\n` +
                    `${originalFormatted.short} ${data.fromCurrency} = ${convertedFormatted.short} ${data.toCurrency}\n` +
                    (hasMB ? `(${originalFormatted.full} = ${convertedFormatted.full})\n` : '') +
                    (originalFormatted.chinese ? `${data.fromCurrency}: ${originalFormatted.chinese}\n` : '') +
                    (convertedFormatted.chinese ? `${data.toCurrency}: ${convertedFormatted.chinese}` : '');
        
        chrome.tabs.sendMessage(tab.id, {
          type: 'showResult',
          text: text,
          mouseX: x,
          mouseY: y
        });
      } catch (error) {
        console.error('獲取匯率失敗:', error);
        chrome.tabs.sendMessage(tab.id, {
          type: 'showError',
          text: `無法獲取匯率，請稍後再試\n可能原因：\n1. 網路連線問題\n2. API 服務暫時無法使用\n3. 選擇的貨幣不支援`,
          mouseX: x,
          mouseY: y
        });
      }
    });
  } else {
    chrome.tabs.sendMessage(tab.id, {
      type: 'showError',
      text: '請選擇有效的數字',
      mouseX: x,
      mouseY: y
    });
  }
}

// 監聽快捷鍵
chrome.commands.onCommand.addListener(async (command) => {
  console.log('快捷鍵被觸發:', command);  // 添加調試日誌
  if (command === 'convert-selection') {
    // 獲取當前標籤頁
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('當前標籤頁:', tab);  // 添加調試日誌
    
    // 執行腳本獲取選取的文字
    try {
      const [{result}] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const selection = window.getSelection();
          console.log('選取的文字:', selection.toString().trim());  // 添加調試日誌
          return selection.toString().trim();
        }
      });
      
      if (result) {
        // 獲取滑鼠位置
        const [{result: pos}] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            return {
              x: window.mouseX || 0,
              y: window.mouseY || 0
            };
          }
        });
        
        handleConversion(result, tab, pos.x, pos.y);
      } else {
        chrome.tabs.sendMessage(tab.id, {
          type: 'showError',
          text: '請先選取數字',
          mouseX: 0,
          mouseY: 0
        });
      }
    } catch (error) {
      console.error('執行腳本失敗:', error);
    }
  }
});

// 處理右鍵選單點擊
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertCurrency") {
    handleConversion(info.selectionText, tab, info.x, info.y);
  }
});

// 監聽來自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'clearCache') {
    // 清除緩存
    rateCache.data = {};
    rateCache.timestamp = {};
  }
}); 