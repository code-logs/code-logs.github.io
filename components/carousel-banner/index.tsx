import { GtagEventName, GTagUtil } from '../../utils/GTagUtil'

export interface Banner {
  title: string
  bannerSrc: string
  link: string
}

export interface CarouselBannerProps {
  banners: Banner[]
}

export default function CarouselBanner({ banners }: CarouselBannerProps) {
  return (
    <div className="max-w-[400px] mt-wide mx-auto">
      {banners.map(({ title, bannerSrc, link }) => (
        <a
          key={link}
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            GTagUtil.log(GtagEventName.BannerClick, {
              title,
              link,
            })
          }}
        >
          <img src={bannerSrc} alt={title} width={400} height={131} className="max-w-full" />
        </a>
      ))}
    </div>
  )
}
