'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Reduced-motion guard ──────────────────────────────────────────────────────
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── IntersectionObserver hook ─────────────────────────────────────────────────
// Fires once when the element enters the viewport, then disconnects.
export function useIntersectionObserver(
  threshold = 0.12,
  rootMargin = '0px',
) {
  const ref       = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (checkReducedMotion()) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, visible }
}

// ── Scroll progress (0→1) for the full page ───────────────────────────────────
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}

// ── Scroll progress for a specific element (0→1) ─────────────────────────────
export function useElementScrollProgress() {
  const ref      = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect   = el.getBoundingClientRect()
      const vh     = window.innerHeight
      const total  = rect.height - vh
      const entered = -rect.top
      setProgress(Math.max(0, Math.min(1, total > 0 ? entered / total : 0)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { ref, progress }
}

// ── Parallax offset (px) for an element ──────────────────────────────────────
// speed: 0 = no movement, 1 = moves with scroll, 0.1 = slow parallax
export function useParallax(speed = 0.1) {
  const ref    = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (checkReducedMotion()) return

    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect    = el.getBoundingClientRect()
      const centre  = rect.top + rect.height / 2
      const delta   = centre - window.innerHeight / 2
      setOffset(delta * speed)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return { ref, offset }
}

// ── Counter animation (RAF-based, not CSS) ────────────────────────────────────
// Calls onUpdate with the current value each frame.
// Returns a start() function — call on element enter.
export function counterAnimation(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
): () => void {
  if (checkReducedMotion()) {
    onUpdate(to)
    onComplete?.()
    return () => {}
  }

  let start: number | null = null
  let raf: number

  const step = (timestamp: number) => {
    if (start === null) start = timestamp
    const elapsed  = timestamp - start
    const progress = Math.min(elapsed / duration, 1)
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3)
    onUpdate(from + (to - from) * eased)
    if (progress < 1) {
      raf = requestAnimationFrame(step)
    } else {
      onUpdate(to)
      onComplete?.()
    }
  }

  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

// ── Text scramble utility ─────────────────────────────────────────────────────
// Cycles random JetBrains Mono characters before resolving to the target string.
// Returns a cleanup function.
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

export function textScramble(
  target: string,
  onUpdate: (text: string) => void,
  duration = 800,
): () => void {
  if (checkReducedMotion()) {
    onUpdate(target)
    return () => {}
  }

  let raf: number
  const start = performance.now()

  const step = (now: number) => {
    const elapsed  = now - start
    const progress = Math.min(elapsed / duration, 1)
    const resolved = Math.floor(progress * target.length)

    const result = target
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (i < resolved) return char
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      })
      .join('')

    onUpdate(result)
    if (progress < 1) {
      raf = requestAnimationFrame(step)
    } else {
      onUpdate(target)
    }
  }

  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

// ── useTextScramble hook ──────────────────────────────────────────────────────
export function useTextScramble(target: string, trigger: boolean, duration = 800) {
  const [text, setText] = useState(target)

  useEffect(() => {
    if (!trigger) return
    const cleanup = textScramble(target, setText, duration)
    return cleanup
  }, [trigger, target, duration])

  return text
}

// ── Lerp position utility (for custom cursor) ─────────────────────────────────
export function lerpPosition(current: number, target: number, factor: number): number {
  return current + (target - current) * factor
}

// ── useMousePosition hook ─────────────────────────────────────────────────────
export function useMousePosition() {
  const pos = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return pos
}

// ── Stagger delay helper ──────────────────────────────────────────────────────
// Returns inline style with animation delay for staggered children.
export function staggerDelay(index: number, baseMs = 80): React.CSSProperties {
  return { animationDelay: `${index * baseMs}ms`, transitionDelay: `${index * baseMs}ms` }
}
