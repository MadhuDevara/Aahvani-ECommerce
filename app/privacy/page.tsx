import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Aahvani Jewels',
  description: 'Read our privacy policy to understand how Aahvani Jewels collects, uses and protects your personal data.',
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-[#C6973F]/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" /></svg>
      <span className="h-px w-8 bg-[#C6973F]/40" />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">{title}</h2>
      <div className="space-y-3 text-sm text-[#1A1A1A]/60 font-light leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* Header */}
      <section className="py-16 md:py-20 text-center px-4 border-b border-[#C6973F]/10">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-3">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-3">Privacy Policy</h1>
        <GoldDivider />
        <p className="mt-4 text-xs text-[#1A1A1A]/35 font-light">Last updated: 2 May 2026</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-white border border-[#1A1A1A]/8 p-8 md:p-12 space-y-10">

          <Section title="1. Introduction">
            <p>
              Welcome to Aahvani Jewels (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy explains how we collect, use, store
              and protect your information when you visit our website or make a purchase.
            </p>
            <p>
              By using our website, you agree to the collection and use of information in accordance with
              this policy. If you do not agree, please do not use our services.
            </p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="2. Information We Collect">
            <p>We collect the following types of personal information:</p>
            <ul className="space-y-2 ml-4">
              {[
                'Name, email address and phone number when you create an account or place an order',
                'Delivery address and billing details for order fulfilment',
                'Payment information (processed securely — we do not store card details)',
                'Browsing behaviour and product preferences via cookies and analytics',
                'Messages and correspondence you send us via the contact form',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6973F] flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="3. How We Use Your Information">
            <p>We use your personal data to:</p>
            <ul className="space-y-2 ml-4">
              {[
                'Process and fulfil your orders, including sending order confirmations and tracking updates',
                'Create and manage your account',
                'Respond to your customer service queries',
                'Send you promotional emails (only if you opt in)',
                'Improve our website, products and services',
                'Comply with legal obligations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6973F] flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="4. Cookies">
            <p>
              We use cookies to enhance your browsing experience. Cookies are small text files stored on
              your device. They help us remember your preferences, understand how you use our site, and
              show you relevant content.
            </p>
            <p>
              You can control cookie settings through your browser. However, disabling cookies may affect
              certain features of our website, including the shopping cart.
            </p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="5. Data Sharing">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your
              data with:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                'Courier partners (Blue Dart, Delhivery, etc.) to fulfil deliveries',
                'Payment gateways (Razorpay, PayU) to process transactions securely',
                'Email service providers to send transactional and marketing emails',
                'Analytics services (Google Analytics) in anonymised form',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6973F] flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p>All third-party partners are contractually obligated to keep your data secure and confidential.</p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="6. Data Retention">
            <p>
              We retain your personal data only as long as necessary for the purposes outlined in this
              policy, or as required by law. Order records are kept for 7 years for accounting and legal
              purposes. Account data is deleted upon request.
            </p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="space-y-2 ml-4">
              {[
                'Access the personal data we hold about you',
                'Request correction of inaccurate data',
                'Request deletion of your data ("right to be forgotten")',
                'Opt out of marketing communications at any time',
                'Withdraw consent for data processing',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6973F] flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:hello@aahvani.com" className="text-[#C6973F] hover:underline">hello@aahvani.com</a>.</p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="8. Security">
            <p>
              We implement industry-standard security measures including SSL encryption, secure servers, and
              limited data access to protect your personal information. However, no method of transmission
              over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with
              an updated date. We encourage you to review this page periodically.
            </p>
          </Section>

          <div className="h-px bg-[#1A1A1A]/6" />

          <Section title="10. Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="bg-[#C6973F]/6 border border-[#C6973F]/15 p-4 mt-2 space-y-1">
              <p><span className="font-medium text-[#1A1A1A]/80">Email:</span> <a href="mailto:hello@aahvani.com" className="text-[#C6973F]">hello@aahvani.com</a></p>
              <p><span className="font-medium text-[#1A1A1A]/80">Address:</span> 42, Jewellers Lane, Mumbai, Maharashtra – 400002</p>
              <p><span className="font-medium text-[#1A1A1A]/80">Phone:</span> +91 98765 43210</p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
