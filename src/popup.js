document.addEventListener('DOMContentLoaded', function() {
  // 載入儲存的設定
  chrome.storage.sync.get(['fromCurrency', 'toCurrency'], function(data) {
    if (data.fromCurrency) {
      document.getElementById('fromCurrency').value = data.fromCurrency;
    }
    if (data.toCurrency) {
      document.getElementById('toCurrency').value = data.toCurrency;
    }
  });

  // 儲存設定
  document.getElementById('save').addEventListener('click', function() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    chrome.storage.sync.set({
      fromCurrency: fromCurrency,
      toCurrency: toCurrency
    }, function() {
      alert('設定已儲存！');
    });
  });
}); 