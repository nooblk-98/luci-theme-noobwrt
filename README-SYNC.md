# LuCI Theme Auto-Sync

Automatically watch and sync theme changes to your OpenWrt router via SFTP.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure router credentials:**
   
   Edit `watch-sync.js` and update the `CONFIG` section:
   ```javascript
   const CONFIG = {
     host: '192.168.1.1',  // Your router's IP
     port: 22,
     username: 'root',
     password: 'your_password',  // Or use privateKey
   };
   ```

   Alternatively, use SSH key authentication:
   ```javascript
   const CONFIG = {
     host: '192.168.1.1',
     port: 22,
     username: 'root',
     privateKey: require('fs').readFileSync('C:\\Users\\YourUser\\.ssh\\id_rsa'),
   };
   ```

## Usage

Start the sync watcher:
```bash
npm run sync
```

Or:
```bash
node watch-sync.js
```

The script will:
- Connect to your router via SFTP
- Watch for file changes in:
  - `ucode\template\themes\argon\*`
  - `htdocs\luci-static\argon\*`
  - `htdocs\luci-static\resources\menu-argon.js`
- Automatically upload changed files to corresponding router paths:
  - `/usr/share/ucode/luci/template/themes/argon/*`
  - `/www/luci-static/argon/*`
  - `/www/luci-static/resources/menu-argon.js`

## Synced Paths

| Local Path | Router Path |
|------------|-------------|
| `ucode\template\themes\argon\*` | `/usr/share/ucode/luci/template/themes/argon/*` |
| `htdocs\luci-static\argon\*` | `/www/luci-static/argon/*` |
| `htdocs\luci-static\resources\menu-argon.js` | `/www/luci-static/resources/menu-argon.js` |

## Features

- ✅ Real-time file watching
- ✅ Automatic reconnection on connection loss
- ✅ Handles file additions, changes, and deletions
- ✅ Debounced uploads (waits for file writes to complete)
- ✅ Clear console output with emojis
- ✅ Graceful shutdown (Ctrl+C)

## Troubleshooting

**Connection fails:**
- Check router IP and credentials
- Ensure SSH/SFTP is enabled on your router
- Verify network connectivity

**Files not syncing:**
- Check console output for errors
- Verify the local paths exist
- Ensure you have write permissions on the router

**Need to clear browser cache:**
After syncing CSS/JS files, you may need to clear your browser cache or do a hard refresh (Ctrl+F5) to see changes.

## Stop Watching

Press `Ctrl+C` to stop the watcher and disconnect from the router.
