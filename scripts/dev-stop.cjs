/**
 * Stops the background dev server started by `npm run dev` (PID in .next/dev-server.pid),
 * then clears anything left on port 3000 (Windows).
 */
const fs = require('node:fs')
const path = require('node:path')
const { execSync, spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const pidPath = path.join(root, '.next', 'dev-server.pid')

if (fs.existsSync(pidPath)) {
  const pid = fs.readFileSync(pidPath, 'utf8').trim()
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' })
    } else {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' })
    }
  } catch {
    /* already exited */
  }
  try {
    fs.unlinkSync(pidPath)
  } catch {
    /* ignore */
  }
}

if (process.platform === 'win32') {
  spawnSync(process.execPath, [path.join(__dirname, 'kill-port-3000.cjs'), '--silent'], {
    cwd: root,
    stdio: 'ignore',
    windowsHide: true,
  })
}

console.error('Stopped dev server (if it was running).')
