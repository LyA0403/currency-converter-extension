# 匯率小工具 (Currency Converter Extension)

快速轉換各國貨幣匯率的 Chrome 擴充功能。

## 功能特點
- 支援多國貨幣即時轉換
- 右鍵選單快速轉換
- 快捷鍵支援（Alt+V，Mac 上使用 Command+Shift+C）
- 支援 M（百萬）/B（十億）/T（兆）單位轉換
- 自動轉換為中文數字表示
- 支援深色模式
- 匯率資料自動緩存

## 安裝方式
1. 下載此專案的 ZIP 檔案
2. 解壓縮下載的檔案
3. 開啟 Chrome 瀏覽器，輸入 `chrome://extensions/`
4. 開啟右上角的「開發人員模式」
5. 點擊「載入未封裝項目」
6. 選擇解壓縮後的 `currency-converter-extension` 資料夾

## 使用方法
1. 在網頁上選取數字（支援一般數字和 M/B/T 單位）
2. 使用以下任一方式轉換：
   - 右鍵點擊選擇「轉換匯率」
   - 使用快捷鍵 Alt+V（Mac 上使用 Command+Shift+C）
3. 在插件設定中可以選擇預設的貨幣組合

## 支援的貨幣
- USD（美元）
- TWD（新台幣）
- EUR（歐元）
- JPY（日圓）
- CNY（人民幣）
- 以及更多其他主要貨幣

## 開發資訊
- 使用 Chrome Extension Manifest V3
- 即時匯率資料來源：ExchangeRate-API
- 支援深色模式自適應
- 匯率資料緩存機制（5分鐘）

## 版本資訊
- 版本：1.0
- 最後更新：2024年3月

## 授權
MIT License
