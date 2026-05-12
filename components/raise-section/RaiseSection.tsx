import { useEffect, useRef, useState } from 'react'

export interface RaiseSectionProps extends React.HTMLProps<HTMLElement> {
  timeout?: number
}

const RaiseSection = ({ timeout = 500, children, ...rest }: RaiseSectionProps) => {
  const ref = useRef<HTMLElement>(null)
  const [isRaise, setIsRaise] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsRaise(Boolean(ref.current))
    }, timeout)
  }, [timeout])

  return (
    <section
      ref={ref}
      className={`translate-y-[20px] opacity-0 transition-all duration-500 ease-in ${isRaise ? 'translate-y-0 opacity-100' : ''}`}
      {...rest}
    >
      {children}
    </section>
  )
}

export default RaiseSection
