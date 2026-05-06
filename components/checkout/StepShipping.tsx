'use client'

import { Truck, Zap } from 'lucide-react'

export type ShippingMethod = 'standard' | 'express'

export const EXPRESS_SHIPPING_FEE = 299

type StepShippingProps = {
  method: ShippingMethod
  onSelect: (m: ShippingMethod) => void
}

const OPTIONS: {
  id: ShippingMethod
  title: string
  detail: string
  feeLabel: string
  fee: number
  Icon: typeof Truck
}[] = [
  {
    id: 'standard',
    title: 'Standard',
    detail: '5–7 business days',
    feeLabel: 'FREE',
    fee: 0,
    Icon: Truck,
  },
  {
    id: 'express',
    title: 'Express',
    detail: '2–3 business days',
    feeLabel: `₹${EXPRESS_SHIPPING_FEE.toLocaleString('en-IN')}`,
    fee: EXPRESS_SHIPPING_FEE,
    Icon: Zap,
  },
]

export default function StepShipping({ method, onSelect }: StepShippingProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {OPTIONS.map(({ id, title, detail, feeLabel, Icon }) => {
        const active = method === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex w-full flex-col gap-3 rounded-sm border p-4 text-left transition-colors duration-200 ${
              active
                ? 'border-lux-gold bg-lux-gold/[0.06] shadow-sm'
                : 'border-lux-stone-light bg-lux-ivory hover:border-lux-gold/45'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    active ? 'border-lux-gold bg-lux-gold/15 text-lux-gold' : 'border-lux-stone-light text-lux-ink-muted'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${active ? 'text-lux-gold' : 'text-lux-ink'}`}>
                    {title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-light text-lux-ink-muted">{detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold tabular-nums ${active ? 'text-lux-gold' : 'text-lux-ink'}`}>{feeLabel}</span>
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? 'border-lux-gold' : 'border-lux-stone-mid'
                  }`}
                  aria-hidden
                >
                  {active ? <span className="h-2 w-2 rounded-full bg-lux-gold" /> : null}
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function shippingFeeForMethod(method: ShippingMethod): number {
  return method === 'express' ? EXPRESS_SHIPPING_FEE : 0
}
