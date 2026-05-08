'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const curRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rx = useRef(0)
  const ry = useRef(0)
  const mx = useRef(0)
  const my = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY
      if (curRef.current) {
        curRef.current.style.left = e.clientX + 'px'
        curRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.18
      ry.current += (my.current - ry.current) * 0.18
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top  = ry.current + 'px'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="custom-cursor" ref={curRef} />
      <div id="cursor-ring"   ref={ringRef} />
    </>
  )
}
