/**
 * Starts Next.js dev in the background so `npm run dev` exits and your terminal is usable.
 * Logs: .next/dev-server.log | Stop: npm run dev:stop
 * Foreground + live output: npm run dev:attach
 */
const { spawn, spawnSync, execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const nextCli = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const extra = process.argv.slice(2)

const wantsTurbo = extra.some((a) => a === '--turbo' || a === '--turbopack')
const forwarded = extra.filter((a) => a !== '--turbo' && a !== '--turbopack')
const bundlerArgs = wantsTurbo ? ['--turbopack'] : ['--webpack']
const listenHost = ['-H', '127.0.0.1']

function freePort3000() {
  if (process.env.AAHVANI_SKIP_KILL_PORT === '1') return
  if (process.platform === 'win32') {
    spawnSync(process.execPath, [path.join(__dirname, 'kill-port-3000.cjs'), '--silent'], {
      cwd: root,
      stdio: 'ignore',
      windowsHide: true,
    })
    return
  }
  try {
    const out = execSync('lsof -ti:TCP:3000 -sTCP:LISTEN', { encoding: 'utf8' }).trim()
    if (!out) return
    for (const pid of out.split(/\n/).filter(Boolean)) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' })
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* lsof missing or nothing listening */
  }
}

freePort3000()

const nextDir = path.join(root, '.next')
fs.mkdirSync(nextDir, { recursive: true })
const logPath = path.join(nextDir, 'dev-server.log')
const pidPath = path.join(nextDir, 'dev-server.pid')

const logFd = fs.openSync(logPath, 'w')

const child = spawn(process.execPath, [nextCli, 'dev', ...listenHost, ...bundlerArgs, ...forwarded], {
  cwd: root,
  detached: true,
  stdio: ['ignore', logFd, logFd],
  env: process.env,
  windowsHide: true,
})

fs.closeSync(logFd)

if (!child.pid) {
  console.error('Failed to start Next.js dev server.')
  process.exit(1)
}

child.unref()

fs.writeFileSync(pidPath, String(child.pid), 'utf8')

const mode = wantsTurbo ? 'Turbopack' : 'webpack'
console.error('')
console.error(`  Dev server is running in the background (${mode}, PID ${child.pid}).`)
console.error('  ▸ Open http://127.0.0.1:3000 (not localhost — avoids Cursor browser hangs on Windows)')
console.error(`  ▸ Logs: ${path.relative(process.cwd(), logPath)}`)
console.error('  ▸ Stop: npm run dev:stop')
console.error('  ▸ Follow log (PowerShell): Get-Content .next/dev-server.log -Wait -Tail 40')
console.error('  ▸ Live output in this terminal: npm run dev')
console.error('')
process.exit(0)
