import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS v4: theme tokens live in `app/globals.css` (`@theme inline` + `:root`).
 * This file exists for tooling compatibility and explicit `content` paths.
 * @see https://tailwindcss.com/docs/v4-beta
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
