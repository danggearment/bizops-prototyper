import { useCallback, useEffect, useRef } from "react"

type UseObserverProps = {
  onIntersect: (entry: IntersectionObserverEntry) => void
}

export const useObserver = <T extends HTMLElement>({
  onIntersect,
}: UseObserverProps) => {
  const observer = useRef<IntersectionObserver>(undefined)
  const setElement = useCallback(
    (node: T) => {
      if (observer.current) {
        observer.current.disconnect()
      }

      if (node) {
        observer.current = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onIntersect(entry)
            }
          })
        })
        observer.current.observe(node)
      }
    },
    [onIntersect],
  )

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return setElement
}
