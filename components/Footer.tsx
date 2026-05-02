'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send } from 'lucide-react'

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
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-1">
              <span className="font-serif text-2xl font-semibold text-[#C6973F] tracking-[0.08em]">
                Aahvani
              </span>
            </Link>
            <p className="text-[0.58rem] tracking-[0.22em] uppercase text-white/25 mb-4 ml-0.5">
              An Invitation to Elegance
            </p>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-[240px]">
              Handcrafted jewellery that celebrates every precious moment in your life.
            </p>
            <div className="flex items-center gap-3 mt-7">
              {SOCIAL.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/35 hover:border-[#C6973F] hover:text-[#C6973F] transition-all duration-200"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.62rem] tracking-[0.32em] uppercase text-[#C6973F] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/40 text-sm font-light hover:text-[#C6973F] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[0.62rem] tracking-[0.32em] uppercase text-[#C6973F] mb-6">
              Customer Care
            </h4>
            <ul className="space-y-3.5">
              {CUSTOMER_CARE.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/40 text-sm font-light hover:text-[#C6973F] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[0.62rem] tracking-[0.32em] uppercase text-[#C6973F] mb-6">
              Newsletter
            </h4>
            <p className="text-white/35 text-sm font-light leading-relaxed mb-5">
              Subscribe for new collections and exclusive member offers.
            </p>
            {subscribed ? (
              <p className="text-[#C6973F] text-sm font-light">
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
                  className="flex-1 min-w-0 bg-white/5 border border-white/12 px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C6973F] transition-colors duration-200"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="w-11 flex-shrink-0 bg-[#C6973F] hover:bg-[#b5872e] transition-colors duration-200 flex items-center justify-center"
                >
                  <Send size={13} strokeWidth={1.5} className="text-white" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs font-light tracking-wide">
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
                className="text-white/20 text-xs hover:text-[#C6973F] transition-colors duration-200"
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
