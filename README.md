# MultiSearch

A Chrome extension that lets you switch between popular search engines with one click — no retyping needed!

**Not affiliated with any search engine providers.**

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this directory
4. The extension will now be active on all major search engines

## Usage

1. Perform a search on any major search engine
2. Click the small tab on the left edge of the screen
3. Click any icon to open the same search on a different engine
4. Hover over icons to see the engine name

## Features

- **Multiple search engines** supported
- **Sleek icon strip** that slides in from the left edge
- **Tooltips** on hover for clarity
- **Real-time updates** — links update as you type
- **Privacy-first** — no data collection, all processing happens locally
- **Secure** — safe link handling with `noopener noreferrer`
- **Lightweight** — minimal permissions, no background scripts

## Why MultiSearch?

Sometimes you want a second opinion on search results, or different engines excel at different queries. Switch instantly without retyping!

## Deployment

### Build the extension

**Windows:**
```cmd
build.bat
```
Or:
```cmd
python scripts\build.py
```

**Linux/macOS:**
```bash
./scripts/build.sh
```

Then upload to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)

### Automated with GitHub Actions

```bash
git tag v2.1.0
git push origin v2.1.0
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

## License

MIT License — Free to use and modify

## Author

**Marcus Ackre Medina**  
hello@marcusmedina.pro  
https://github.com/MarcusMedina/MultiSearch
