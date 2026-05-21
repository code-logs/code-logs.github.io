export interface TitleWithCountProps {
  level?: 1 | 2 | 3
  title: string
  count: number
}

const TitleWithCount = (props: TitleWithCountProps) => {
  const innerFragment = (
    <>
      {props.title} <span className="text-text-muted font-medium">({props.count})</span>
    </>
  )

  switch (props.level) {
    case 1:
      return <h1>{innerFragment}</h1>

    case 2:
      return <h2>{innerFragment}</h2>

    case 3:
      return <h3>{innerFragment}</h3>

    default:
      return <h1>{innerFragment}</h1>
  }
}

export default TitleWithCount
