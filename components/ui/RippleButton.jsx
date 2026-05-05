'use client'

import { useRef } from 'react'
import { useRipple } from '@/hooks/useRipple'

export default function RippleButton({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}) {
  const buttonRef = useRef(null)
  const { ripples, createRipple } = useRipple(600)

  const handleClick = (e) => {
    if (disabled) return
    createRipple(e, buttonRef.current)
    onClick?.(e)
  }

  const handleTouchStart = (e) => {
    if (disabled) return
    createRipple(e, buttonRef.current)
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className={`relative overflow-hidden touch-manipulation ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple-expand 600ms ease-out forwards',
          }}
        />
      ))}
    </button>
  )
}
