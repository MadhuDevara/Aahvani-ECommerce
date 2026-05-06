'use client'

import LuxInput from '@/components/checkout/LuxInput'

export type PaymentMode = 'card' | 'upi'

export type StepPaymentFields = {
  cardNumber: string
  expiry: string
  cvv: string
  upiId: string
}

type StepPaymentProps = {
  mode: PaymentMode
  onModeChange: (m: PaymentMode) => void
  fields: StepPaymentFields
  onFieldChange: <K extends keyof StepPaymentFields>(field: K, value: StepPaymentFields[K]) => void
  errors: Partial<Record<keyof StepPaymentFields, string>>
}

export default function StepPayment({
  mode,
  onModeChange,
  fields,
  onFieldChange,
  errors,
}: StepPaymentProps) {
  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-sm border border-lux-stone-light p-0.5">
        <button
          type="button"
          onClick={() => onModeChange('card')}
          className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
            mode === 'card' ? 'bg-lux-black text-lux-ivory' : 'text-lux-ink-muted hover:text-lux-ink'
          }`}
        >
          Card
        </button>
        <button
          type="button"
          onClick={() => onModeChange('upi')}
          className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
            mode === 'upi' ? 'bg-lux-black text-lux-ivory' : 'text-lux-ink-muted hover:text-lux-ink'
          }`}
        >
          UPI
        </button>
      </div>

      {mode === 'card' ? (
        <div className="space-y-5">
          <LuxInput
            label="Card number"
            name="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder=" "
            value={fields.cardNumber}
            onChange={(e) => onFieldChange('cardNumber', e.target.value)}
            error={errors.cardNumber}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <LuxInput
              label="Expiry (MM/YY)"
              name="expiry"
              autoComplete="cc-exp"
              inputMode="numeric"
              value={fields.expiry}
              onChange={(e) => onFieldChange('expiry', e.target.value)}
              error={errors.expiry}
            />
            <LuxInput
              label="CVV"
              name="cvv"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              value={fields.cvv}
              onChange={(e) => onFieldChange('cvv', e.target.value)}
              error={errors.cvv}
            />
          </div>
        </div>
      ) : (
        <LuxInput
          label="UPI ID"
          name="upiId"
          autoComplete="off"
          placeholder=" "
          value={fields.upiId}
          onChange={(e) => onFieldChange('upiId', e.target.value)}
          error={errors.upiId}
        />
      )}

      <p className="text-[11px] font-light leading-relaxed text-lux-ink-muted">
        Your payment details are encrypted in transit. We never store full card numbers on our servers.
      </p>
    </div>
  )
}
