import { useRouter } from 'next/router'
import MarkedAnchor from '../marked-anchor/MarkedAnchor'

export interface Menu {
  display: string
  route: string
}

export interface NavBarProps {
  menus: Menu[]
}

const NavBar = (props: NavBarProps) => {
  const { menus } = props
  const router = useRouter()

  return (
    <nav className="flex-1 text-center">
      <ul className="inline-flex gap-5 m-auto p-0 font-medium">
        {menus.map(({ display, route }, idx) => (
          <li className="clickable" key={idx}>
            <MarkedAnchor href={route} display={display} matched={router.pathname.split('/')[1] === route.split('/')[1]} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar
