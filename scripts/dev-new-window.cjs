/**
 * Windows: opens a new cmd.exe window running `npm run dev` so this terminal
 * returns to a prompt immediately. (next dev always blocks — that is normal.)
 */
const { spawn } = require('node:child_process')
const path = require('node:path')

const root = path.resolve(__dirname, '..')

if (process.platform !== 'win32') {
  console.error(
    '`npm run dev:new-window` only spawns a separate console on Windows.\n' +
      'Otherwise: open another terminal tab in this folder and run `npm run dev`.'
  )
  process.exit(1)
}

const folderArg = root.includes(' ') ? `"${root}"` : root
const cmdLine = `cd /d ${folderArg} && npm run dev`

const child = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', cmdLine], {
  cwd: root,
  stdio: 'ignore',
})

child.unref()

console.log('Opened a new Command Prompt running npm run dev (live logs there).')
console.log('This terminal is free again.')
