
"use client"

import { useEffect, useState } from "react"

/**
 * A custom hook to determine if the device is mobile based on screen width.
 * @returns {boolean} `true` if the screen width is less than 768px, otherwise `false`.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check on mount (client-side)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Corresponds to md breakpoint in Tailwind
    }

    handleResize() // Initial check

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}
