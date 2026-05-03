/**
 * Wrapper around `next dev` so "✓ Ready" is clearly success, not a hang.
 * Defaults to webpack — clearer compile logs on many Windows setups.
 * Turbopack: npm run dev:turbo
 *
 * On Windows, frees port 3000 before starting so a stray `next dev` does not trigger
 * "Another next dev server is already running".
 * Opt out: set AAHVANI_SKIP_KILL_PORT=1
 */
const { spawn, spawnSync } = require('node:child_process')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const nextCli = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const extra = process.argv.slice(2)

const wantsTurbo = extra.some((a) => a === '--turbo' || a === '--turbopack')
const forwarded = extra.filter((a) => a !== '--turbo' && a !== '--turbopack')
const bundlerArgs = wantsTurbo ? ['--turbopack'] : ['--webpack']
/** Cursor Simple Browser + some Windows setups hang on `localhost`; IPv4 is reliable. */
const listenHost = ['-H', '127.0.0.1']

if (process.platform === 'win32' && process.env.AAHVANI_SKIP_KILL_PORT !== '1') {
  spawnSync(process.execPath, [path.join(__dirname, 'kill-port-3000.cjs'), '--silent'], {
    cwd: root,
    stdio: 'ignore',
    windowsHide: true,
  })
}

console.error('')
console.error('  ────────────────────────────────────────────────────────────')
console.error('  Aahvani — Next.js dev')
console.error('  • After "Ready": open http://127.0.0.1:3000 (use this URL in Cursor browser + Chrome).')
console.error('  • This terminal stays open until Ctrl+C (normal). Background: npm run dev:bg')
if (process.platform === 'win32' && process.env.AAHVANI_SKIP_KILL_PORT !== '1') {
  console.error('  • Windows: cleared anything still listening on port 3000.')
}
console.error('  • Turbopack: npm run dev:turbo')
console.error('  ────────────────────────────────────────────────────────────')
console.error('')

const child = spawn(process.execPath, [nextCli, 'dev', ...listenHost, ...bundlerArgs, ...forwarded], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code === null || code === undefined ? 1 : code)
})
