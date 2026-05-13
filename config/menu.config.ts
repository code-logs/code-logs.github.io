import { Menu } from '../components/nav-bar/NavBar'

const menus: Menu[] = [
  { display: 'Home', route: '/' },
  { display: 'Posts', route: '/posts/1' },
  { display: 'About', route: '/about' },
  ...(process.env.NODE_ENV !== 'production'
    ? [{ display: 'Authoring (dev)', route: '/dev/authoring' }]
    : []),
]

export default menus
