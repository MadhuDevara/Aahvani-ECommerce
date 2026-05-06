'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send } from 'lucide-react'
import { usePathname } from 'next/navigation'

const QUICK_LINKS = [
  { label: 'Home',        href: '/'            },
  { label: 'Shop',        href: '/shop'         },
  { label: 'Collections', href: '/collections'  },
  { label: 'About',       href: '/about'        },
  { label: 'Contact',     href: '/contact'      },
]

const CUSTOMER_CARE = [
  { label: 'Size Guide',      href: '/size-guide'   },
  { label: 'Shipping Policy', href: '/shipping'     },
  { label: 'Return Policy',   href: '/returns'      },
  { label: 'Track Order',     href: '/track-order'  },
  { label: 'FAQ',             href: '/faq'          },
]

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  )
}

const SOCIAL = [
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'Facebook',  href: '#', Icon: FacebookIcon  },
  { label: 'YouTube',   href: '#', Icon: YoutubeIcon   },
]

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)

  if (pathname?.startsWith('/admin')) return null

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-lux-black text-lux-ivory">
      <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 pb-12 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-1">
              <span className="font-serif text-2xl font-semibold tracking-[0.08em] text-lux-gold">
                Aahvani
              </span>
            </Link>
            <p className="text-[0.58rem] tracking-[0.22em] uppercase text-lux-ivory/25 mb-4 ml-0.5">
              An Invitation to Elegance
            </p>
            <p className="text-lux-ivory/42 text-sm font-light leading-relaxed max-w-[240px]">
              Handcrafted jewellery that celebrates every precious moment in your life.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-lux-ivory/15 text-lux-ivory/45 transition-all duration-300 hover:border-lux-gold/60 hover:text-lux-gold"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.62rem] tracking-[0.32em] uppercase text-lux-gold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-lux-ivory/42 text-sm font-light hover:text-lux-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[0.62rem] tracking-[0.32em] uppercase text-lux-gold mb-6">
              Customer Care
            </h4>
            <ul className="space-y-3.5">
              {CUSTOMER_CARE.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-lux-ivory/42 text-sm font-light hover:text-lux-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[0.62rem] tracking-[0.32em] uppercase text-lux-gold mb-6">
              Newsletter
            </h4>
            <p className="text-lux-ivory/35 text-sm font-light leading-relaxed mb-5">
              Subscribe for new collections and exclusive member offers.
            </p>
            {subscribed ? (
              <p className="text-lux-gold text-sm font-light">
                Thank you for subscribing! ✦
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 min-w-0 border border-lux-ivory/14 bg-lux-ivory/5 px-3.5 py-2.5 text-sm text-lux-ivory placeholder:text-lux-ivory/22 focus:outline-none focus:border-lux-gold transition-colors duration-200"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-lux-gold transition-colors duration-200 hover:bg-lux-gold-hover"
                >
                  <Send size={13} strokeWidth={1.5} className="text-lux-black" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[min(100%,var(--lux-max))] flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-lux-ivory/22 text-xs font-light tracking-wide">
            © 2026 Aahvani Jewels. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              ['Privacy Policy',   '/privacy'],
              ['Terms of Service', '/terms'  ],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-lux-ivory/22 text-xs hover:text-lux-gold transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
