import { useEffect, useState } from 'react'

const useDimensions = () => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
  }, [])

  return [height, width]
}

export default useDimensions
