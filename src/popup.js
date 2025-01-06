document.addEventListener('DOMContentLoaded', function() {
  // 載入儲存的設定
  chrome.storage.sync.get(['fromCurrency', 'toCurrency', 'showChinese'], function(data) {
    if (data.fromCurrency) {
      document.getElementById('fromCurrency').value = data.fromCurrency;
      updateLastUpdateTime(data.fromCurrency);
    }
    if (data.toCurrency) {
      document.getElementById('toCurrency').value = data.toCurrency;
    }
    if (data.showChinese !== undefined) {
      document.getElementById('showChinese').checked = data.showChinese;
    }
  });

  // 獲取並顯示最後更新時間
  async function updateLastUpdateTime(currency) {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const data = await response.json();
      if (data.rates) {
        const lastUpdated = new Date();
        document.getElementById('lastUpdate').textContent = lastUpdated.toLocaleString();
      }
    } catch (error) {
      document.getElementById('lastUpdate').textContent = '無法獲取更新時間';
    }
  }

  // 儲存設定
  document.getElementById('save').addEventListener('click', function() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const showChinese = document.getElementById('showChinese').checked;

    chrome.storage.sync.set({
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      showChinese: showChinese
    }, function() {
      alert('設定已儲存！');
      updateLastUpdateTime(fromCurrency);
    });
  });

  // 添加重新整理按鈕功能
  document.getElementById('refresh').addEventListener('click', async function() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const button = this;
    button.disabled = true;
    button.textContent = '更新中...';
    
    try {
      // 清除緩存來強制更新
      await chrome.runtime.sendMessage({ type: 'clearCache' });
      await updateLastUpdateTime(fromCurrency);
      button.textContent = '更新成功！';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = '重新整理匯率';
      }, 2000);
    } catch (error) {
      button.textContent = '更新失敗';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = '重新整理匯率';
      }, 2000);
    }
  });
}); 