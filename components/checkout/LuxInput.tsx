'use client'

import { forwardRef, useId, useState } from 'react'
import { motion } from 'framer-motion'
import type { InputHTMLAttributes } from 'react'

export type LuxInputProps = {
  label: string
  error?: string
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { className?: string }

const LuxInput = forwardRef<HTMLInputElement, LuxInputProps>(function LuxInput(
  { label, error, className = '', id: idProp, onFocus, onBlur, ...rest },
  ref,
) {
  const uid = useId()
  const id = idProp ?? uid
  const [focused, setFocused] = useState(false)
  const hasError = Boolean(error)

  return (
    <div className={className}>
      <div className="relative pt-1">
        <input
          ref={ref}
          id={id}
          placeholder=" "
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-err` : undefined}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          className={`peer lux-checkout-input w-full border-0 border-b bg-transparent px-0 pb-2 pt-4 text-sm text-lux-ink outline-none transition-colors duration-200 placeholder:text-transparent ${
            hasError ? 'border-b-red-400' : 'border-b border-lux-stone-light focus:border-transparent'
          }`}
          {...rest}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-4 z-[1] origin-left text-sm text-lux-ink-muted transition-all duration-200 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-lux-gold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-lux-ink"
        >
          {label}
        </label>
        {!hasError ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-px origin-left bg-lux-gold"
            initial={false}
            animate={{ scaleX: focused ? 1 : 0 }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
      </div>
      {hasError ? (
        <p id={`${id}-err`} className="mt-1.5 text-[11px] font-medium text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})

export default LuxInput
