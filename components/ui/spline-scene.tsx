'use client'

import { Suspense, lazy, useState, useEffect } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-black/5 rounded-lg ${className || ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-black/5 rounded-lg ${className || ''}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
