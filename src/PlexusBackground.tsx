import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  phase: number
}

export default function PlexusBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: -1000, y: -1000 }
    let nodes: Node[] = []
    let frameId = 0
    let width = 0
    let height = 0
    let pixelRatio = 1

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const count = Math.max(42, Math.min(92, Math.round(width * height / 15500)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.2 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }
    const onPointerLeave = () => {
      pointer.x = -1000
      pointer.y = -1000
    }
    const onResize = () => {
      resize()
      if (reducedMotion.matches) draw()
    }
    const onMotionPreferenceChange = () => {
      window.cancelAnimationFrame(frameId)
      resize()
      draw()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const linkDistance = Math.min(156, Math.max(108, width * 0.115))
      const pointerRadius = 190
      const time = performance.now() / 1000

      if (pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, pointerRadius * 1.5)
        glow.addColorStop(0, 'rgba(255, 191, 63, 0.15)')
        glow.addColorStop(1, 'rgba(255, 191, 63, 0)')
        context.fillStyle = glow
        context.fillRect(0, 0, width, height)
      }

      nodes.forEach((node, index) => {
        if (!reducedMotion.matches) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < pointerRadius) {
            const force = (pointerRadius - distance) / pointerRadius * 0.45
            node.x += dx / distance * force
            node.y += dy / distance * force
          }
        }

        for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
          const next = nodes[nextIndex]
          const distance = Math.hypot(node.x - next.x, node.y - next.y)
          if (distance >= linkDistance) continue
          const opacity = (1 - distance / linkDistance) * 0.48
          context.strokeStyle = `rgba(255, 190, 64, ${opacity})`
          context.lineWidth = 0.8
          context.beginPath()
          context.moveTo(node.x, node.y)
          context.lineTo(next.x, next.y)
          context.stroke()
        }

        const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y)
        const pulse = 0.55 + (Math.sin(time * 2.8 + node.phase) + 1) * 0.225
        const pointRadius = node.radius * (0.85 + pulse * 0.5)
        context.fillStyle = pointerDistance < pointerRadius
          ? `rgba(255, 210, 104, ${0.76 + (1 - pointerDistance / pointerRadius) * 0.22})`
          : `rgba(255, 184, 48, ${0.67 + pulse * 0.33})`
        context.shadowColor = '#ffbf3f'
        context.shadowBlur = 5 + pulse * 8 + (pointerDistance < pointerRadius ? 5 : 0)
        context.beginPath()
        context.arc(node.x, node.y, pointRadius + (pointerDistance < pointerRadius ? 0.55 : 0), 0, Math.PI * 2)
        context.fill()
        context.shadowBlur = 0
      })

      if (!reducedMotion.matches) frameId = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })
    reducedMotion.addEventListener('change', onMotionPreferenceChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      reducedMotion.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  return <canvas className="plexus-background" ref={canvasRef} aria-hidden="true" />
}
