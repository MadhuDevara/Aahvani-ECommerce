import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

/**
 * Absolute app root (directory that contains this file). Required when another lockfile exists
 * higher in the tree (e.g. `D:\\package-lock.json`); otherwise Turbopack resolves `tailwindcss`
 * from `D:\\` and compilation hangs / fails.
 */
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)))

const nextConfig: NextConfig = {
  turbopack: {
    root: PROJECT_ROOT,
  },
  // Must match `turbopack.root` when both are set (Next validates this).
  outputFileTracingRoot: PROJECT_ROOT,
}

export default nextConfig
