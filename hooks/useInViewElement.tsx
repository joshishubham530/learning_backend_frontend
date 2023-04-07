import { MutableRefObject, useEffect, useMemo, useState } from 'react'

const useInViewElement = ({
  ref,
  optionsProps,
}: {
  ref: MutableRefObject<null>
  optionsProps: {
    root: null | undefined
    rootMargin: string
    threshold: number
  }
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const memoizedOptions = useMemo(() => optionsProps, [optionsProps])

  useEffect(() => {
    const currentRefTarget = ref.current
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries

      setIsVisible(entry.isIntersecting)
    }, memoizedOptions)

    if (currentRefTarget) {
      observer.observe(currentRefTarget)
    }
    return () => {
      if (currentRefTarget) {
        observer.unobserve(currentRefTarget)
      }
    }
  }, [memoizedOptions, ref])

  return [isVisible]
}

export default useInViewElement
