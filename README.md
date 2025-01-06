# Currency Converter Extension

A Chrome extension for quick currency conversion.

[繁體中文](README.zh-TW.md)

## Features
- Support multiple currency conversions
- Quick conversion via context menu
- Keyboard shortcut support (Alt+V, Command+Shift+C for Mac)
- Support for M (Million)/B (Billion)/T (Trillion) units
- Automatic Chinese numeral conversion
- Dark mode support
- Exchange rate data caching

## Installation
1. Download the ZIP file of this project
2. Extract the downloaded file
3. Open Chrome browser and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked"
6. Select the `src` folder from the extracted files

## Usage
1. Click the extension icon to set default currency pair (e.g., USD to TWD)
2. After setting up, you can:
   - Select any number on a webpage (supports regular numbers and M/B/T units)
   - Right-click and select "Convert Currency"
   - Or use the keyboard shortcut Alt+V (Command+Shift+C for Mac)

## Supported Currencies
- USD (US Dollar)
- TWD (Taiwan Dollar)
- EUR (Euro)
- JPY (Japanese Yen)
- CNY (Chinese Yuan)
- And many other major currencies

## Technical Details
- Built with Chrome Extension Manifest V3
- Exchange rate data source: ExchangeRate-API
- Adaptive dark mode support
- Exchange rate data caching (5 minutes)

## Version
- Version: 1.0
- Last Updated: March 2024

## License
MIT License
