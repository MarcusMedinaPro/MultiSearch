# Deployment Guide

Complete guide for publishing MultiSearch to Chrome Web Store, both manually and with GitHub Actions automation.

## Quick Start

### Option 1: Manual Deployment (First Time)

1. **Build the extension:**

   **Windows (CMD):**
   ```cmd
   build.bat
   ```

   **Windows (PowerShell/Python):**
   ```powershell
   python scripts\build.py
   ```

   **Linux/macOS:**
   ```bash
   chmod +x scripts/build.sh
   ./scripts/build.sh
   ```

2. **Go to Chrome Web Store Developer Console:**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Pay $5 one-time registration fee (if first time)

3. **Upload the zip file:**
   - Click "New Item"
   - Upload `multisearch-v2.0.0.zip`
   - Fill in store listing (see below)

### Option 2: Automated with GitHub Actions

After first manual deployment, automate updates:

1. **Set up Chrome Web Store API credentials** (one-time setup)
2. **Push code with version tag:**
   ```bash
   git tag v2.1.0
   git push origin v2.1.0
   ```
3. **GitHub Actions automatically:**
   - Validates code
   - Builds extension
   - Creates GitHub release
   - Publishes to Chrome Web Store

---

## Store Listing Information

> **⚠️ IMPORTANT:** Chrome Web Store rejects listings with more than 5 search engine names.
> Keep descriptions generic to avoid "keyword spam" rejection.

When uploading to Chrome Web Store, use these details:

### Basic Information

**Extension Name:**
```
MultiSearch
```

**Short Description:**
```
Switch between popular search engines with one click — no retyping needed
```

**Detailed Description:**
```
MultiSearch lets you instantly switch between multiple search engines without retyping your query.

✨ Features:
• One-click switching between popular search engines
• Sleek side panel interface
• Real-time query updates
• Works on all major search platforms

🔒 Privacy:
• No tracking or analytics
• No data sent to external servers
• All processing happens locally
• Open source — inspect the code yourself

Simply search on any supported engine, click the side tab, and choose where to search next.

Source code: https://github.com/MarcusMedina/MultiSearch
```

**Category:**
```
Productivity
```

**Language:**
```
English
```

### Privacy Information

**Single Purpose:**
```
Adds search engine switching buttons to search result pages, allowing users to quickly search the same query on a different search engine.
```

**activeTab Permission Justification:**
```
activeTab is required to read the current search query from the page's search input field and to insert the search engine switching buttons into the page. The extension only accesses the active tab when the user is on a supported search engine.
```

**Host Permissions Justification:**
```
Host permissions for specific search engine domains are required because the extension needs to detect when the user is on a search results page and read the search query to enable switching to other search engines.
```

**Are you using remote code?**
```
No
```

**Do you collect user data?**
```
No
```

**Privacy Policy URL:**
```
https://github.com/MarcusMedina/MultiSearch/blob/main/PRIVACY.md
```

### Screenshots

You'll need at least **1 screenshot** (1280x800 or 640x400):

**Screenshot 1: Icon strip visible**
- Navigate to any search engine
- Perform a search
- Click the tab to show the icon strip
- Take screenshot showing the icons

---

## GitHub Actions Setup

### Step 1: First Manual Publication

You **must** publish manually the first time to:
1. Pay the $5 developer fee
2. Create the extension listing
3. Get API credentials

### Step 2: Get Chrome Web Store API Credentials

1. **Enable Chrome Web Store API:**
   - Go to: https://console.cloud.google.com/
   - Create new project (or select existing)
   - Enable "Chrome Web Store API"

2. **Create OAuth credentials:**
   - Go to: APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Application type: "Web application"
   - Note down:
     - Client ID
     - Client Secret

3. **Get Refresh Token:**
   ```bash
   # Use this URL (replace YOUR_CLIENT_ID):
   https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob

   # Exchange authorization code for refresh token:
   curl "https://accounts.google.com/o/oauth2/token" -d \
   "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=YOUR_AUTH_CODE&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
   ```

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add three secrets:
   - `CHROME_CLIENT_ID`: Your OAuth Client ID
   - `CHROME_CLIENT_SECRET`: Your OAuth Client Secret
   - `CHROME_REFRESH_TOKEN`: Your refresh token

### Step 4: Trigger Automated Deployment

```bash
# Update version in manifest.json (e.g., 2.0.0 → 2.1.0)
# Commit changes
git add manifest.json
git commit -m "Bump version to 2.1.0"

# Create and push tag
git tag v2.1.0
git push origin main
git push origin v2.1.0
```

GitHub Actions will automatically:
1. ✅ Validate manifest.json
2. ✅ Build extension zip
3. ✅ Create GitHub release
4. ✅ Upload to Chrome Web Store
5. ✅ Publish (or save as draft)

---

## Version Management

### Semantic Versioning

Follow semantic versioning: `MAJOR.MINOR.PATCH`

- **PATCH** (2.0.0 → 2.0.1): Bug fixes, typos
- **MINOR** (2.0.0 → 2.1.0): New features, improvements
- **MAJOR** (2.0.0 → 3.0.0): Breaking changes

### Updating Version

1. **Edit manifest.json:**
   ```json
   {
     "version": "2.1.0"
   }
   ```

2. **Commit and tag:**
   ```bash
   git add manifest.json
   git commit -m "Bump version to 2.1.0"
   git tag v2.1.0
   git push origin main --tags
   ```

3. **GitHub Actions handles the rest!**

---

## Testing Before Release

### Local Testing

1. Build extension:
   ```bash
   ./scripts/build.sh
   ```

2. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

3. Test on multiple search engines to verify functionality

### Validation Workflow

GitHub Actions automatically validates on every push:
- ✅ manifest.json syntax
- ✅ JavaScript syntax
- ✅ Required files present
- ✅ Icon files present

---

## Troubleshooting

### Build Fails

**Error: "jq: command not found"**
```bash
# Install jq
sudo apt-get install jq  # Ubuntu/Debian
brew install jq          # macOS
```

**Error: "Permission denied"**
```bash
chmod +x scripts/build.sh
```

### GitHub Actions Fails

**Error: "Chrome API credentials not found"**
- Check that secrets are properly set
- Verify secret names match exactly

**Error: "Version already exists"**
- Bump version in manifest.json
- Create new tag with new version

### Chrome Web Store Rejection

**Common reasons:**
- Missing privacy policy
- Keyword spam (listing too many brand names)
- Too many permissions requested
- Icons don't meet requirements (48px, 128px)

**Solutions:**
- Add privacy policy URL
- Use generic descriptions ("popular search engines" instead of listing names)
- Minimise permissions
- Ensure icons are correct size

---

## Resources

- [Chrome Web Store Developer Guide](https://developer.chrome.com/docs/webstore/)
- [Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

---

## Support

- **Issues:** https://github.com/MarcusMedina/MultiSearch/issues
- **Email:** hello@marcusmedina.pro

---

**Happy deploying! 🚀**
