/**
 * Windows: kill whatever process is LISTENING on TCP port 3000 (usually a stray `next dev`).
 * Safe no-op if nothing is listening.
 * Flags: --silent (minimal output; used by run-dev.cjs)
 */
const { execSync } = require('node:child_process')

const silent = process.argv.includes('--silent')

if (process.platform !== 'win32') {
  if (!silent) console.error('kill-port-3000.cjs only supports Windows (uses netstat/taskkill).')
  process.exit(silent ? 0 : 1)
}

let netstat
try {
  netstat = execSync('netstat -ano', { encoding: 'utf8' })
} catch {
  if (!silent) console.error('Could not run netstat.')
  process.exit(silent ? 0 : 1)
}

const pids = new Set()
for (const line of netstat.split(/\r?\n/)) {
  if (!line.includes('LISTENING') || !line.includes(':3000')) continue
  const parts = line.trim().split(/\s+/)
  const pid = parts[parts.length - 1]
  if (/^\d+$/.test(pid)) pids.add(pid)
}

if (pids.size === 0) {
  if (!silent) console.log('Nothing is listening on port 3000.')
  process.exit(0)
}

for (const pid of pids) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: silent ? 'ignore' : 'inherit' })
    if (!silent) console.log(`Stopped PID ${pid}.`)
  } catch {
    if (!silent) console.error(`Could not stop PID ${pid} (maybe already exited).`)
  }
}
