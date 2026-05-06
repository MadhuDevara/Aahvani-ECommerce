'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'

const STEPS = ['Information', 'Shipping', 'Payment'] as const

type StepIndicatorProps = {
  activeStep: number
}

export default function StepIndicator({ activeStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-start justify-center gap-0">
        {STEPS.map((label, i) => {
          const done = activeStep > i
          const current = activeStep === i
          return (
            <Fragment key={label}>
              <div className="flex min-w-0 shrink-0 flex-col items-center gap-2">
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors duration-300 sm:h-10 sm:w-10 ${
                    done || current
                      ? 'border-lux-gold bg-lux-gold text-lux-black'
                      : 'border-lux-stone-light bg-lux-ivory text-lux-ink-muted'
                  }`}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="text-lux-black">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className={current ? 'text-lux-black' : 'text-lux-ink-muted'}>{i + 1}</span>
                  )}
                </div>
                <span className="hidden max-w-[7rem] text-center font-sans text-[11px] font-medium tracking-wide text-lux-ink sm:block">
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 ? (
                <div className="relative mx-2 mt-[18px] h-px min-w-[1.5rem] flex-1 self-start overflow-hidden rounded-full bg-lux-stone-light sm:mx-3 sm:mt-[22px]">
                  <motion.div
                    className="absolute inset-0 origin-left bg-lux-gold"
                    initial={false}
                    animate={{ scaleX: activeStep > i ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                    style={{ width: '100%' }}
                  />
                </div>
              ) : null}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
