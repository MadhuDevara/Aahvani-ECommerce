import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Aahvani Jewels',
  description: 'Read the Terms of Service for Aahvani Jewels — your use of our website and purchases are subject to these terms.',
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-lux-gold/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" /></svg>
      <span className="h-px w-8 bg-lux-gold/40" />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl font-semibold text-lux-ink">{title}</h2>
      <div className="space-y-3 text-sm text-lux-ink/60 font-light leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="bg-lux-ivory">

      {/* Header */}
      <section className="border-b border-lux-gold/10 px-4 py-10 text-center md:py-12">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-lux-gold font-medium mb-3">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-lux-ink mb-3">Terms of Service</h1>
        <GoldDivider />
        <p className="mt-4 text-xs text-lux-ink/35 font-light">Last updated: 2 May 2026</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-white border border-lux-ink/8 p-8 md:p-12 space-y-10">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using the Aahvani Jewels website (&ldquo;Site&rdquo;) and making purchases, you agree to be
              bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these terms, please do not
              use our Site.
            </p>
            <p>
              We reserve the right to update or modify these Terms at any time. Continued use of the Site
              after changes constitutes your acceptance of the revised Terms.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="2. Products & Pricing">
            <p>
              All products are handcrafted and subject to availability. Prices are displayed in Indian Rupees
              (₹) and are inclusive of applicable taxes unless stated otherwise.
            </p>
            <p>
              We reserve the right to modify prices at any time without prior notice. However, the price
              at the time of your order confirmation is the price you will be charged.
            </p>
            <p>
              Product images are for illustrative purposes. As our pieces are handcrafted, there may be
              minor variations in colour, texture, and dimensions compared to the photographs.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="3. Orders & Payments">
            <p>
              By placing an order, you confirm that the information you provide is accurate and complete.
              We reserve the right to cancel any order at our discretion, including in cases of pricing
              errors, fraud, or stock unavailability. A full refund will be issued for any cancelled orders.
            </p>
            <p>
              Accepted payment methods include UPI, Visa, Mastercard, Net Banking, PhonePe, Google Pay,
              and other options displayed at checkout. All transactions are secured with SSL encryption.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="4. Shipping & Delivery">
            <p>
              We ship across India. Delivery timelines are estimates and may vary based on courier partner
              performance and location. Aahvani Jewels is not responsible for delays caused by third-party
              couriers, natural disasters, or unforeseen circumstances.
            </p>
            <p>
              Risk of loss and title for products passes to you upon delivery. Please inspect your package
              upon receipt and report any damage within 48 hours.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="5. Returns & Refunds">
            <p>
              We offer a 7-day return policy for eligible items. Please refer to our{' '}
              <a href="/returns" className="text-lux-gold hover:underline">Returns Policy</a> for full
              details on eligible items, the return process, and refund timelines.
            </p>
            <p>
              Custom and personalised jewellery is non-returnable unless defective. Earrings are
              non-returnable for hygiene reasons unless defective.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="6. Intellectual Property">
            <p>
              All content on this Site — including text, images, logos, jewellery designs, and graphics —
              is the intellectual property of Aahvani Jewels and is protected by copyright law.
            </p>
            <p>
              You may not reproduce, distribute, modify, or republish any content from this Site without
              our express written permission.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="7. User Accounts">
            <p>
              When you create an account, you are responsible for maintaining the confidentiality of your
              login credentials. You agree to notify us immediately of any unauthorised use of your account.
              We are not liable for any loss resulting from unauthorised account access.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Aahvani Jewels shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the Site or our
              products. Our total liability to you for any claim shall not exceed the amount paid for the
              relevant order.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="9. Governing Law">
            <p>
              These Terms are governed by the laws of India. Any disputes arising out of or in connection
              with these Terms shall be subject to the exclusive jurisdiction of courts in Mumbai,
              Maharashtra.
            </p>
          </Section>

          <div className="h-px bg-lux-ink/6" />

          <Section title="10. Contact">
            <p>For any questions about these Terms, please contact:</p>
            <div className="bg-lux-gold/6 border border-lux-gold/15 p-4 mt-2 space-y-1">
              <p><span className="font-medium text-lux-ink/80">Email:</span> <a href="mailto:hello@aahvani.com" className="text-lux-gold">hello@aahvani.com</a></p>
              <p><span className="font-medium text-lux-ink/80">Address:</span> 42, Jewellers Lane, Mumbai, Maharashtra – 400002</p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
