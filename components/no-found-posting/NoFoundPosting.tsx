import MainAdsBanner from '../ads-banner/MainAdsBanner'

export interface NoFoundPostingProps {
  condition: string
}

const NoFoundPosting = ({ condition }: NoFoundPostingProps) => (
  <section>
    <h2 className="text-[1.4rem]">발견된 포팅이 없습니다.</h2>
    <p className="text-[1.2rem]">
      <strong className="text-theme-error">{`'${decodeURIComponent(condition)}'`}</strong>을 통해 발견된 포스팅이 없습니다.
    </p>

    <MainAdsBanner />
  </section>
)

export default NoFoundPosting
