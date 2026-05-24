import FooterBottomBar from './FooterBottomBar'
import FooterBrand from './FooterBrand'
import FooterCategories from './FooterCategories'
import FooterExplore from './FooterExplore'

// Three-column information footer (issue #151): Brand / Explore / Categories +
// a copyright meta bar. The outer <footer> intentionally carries NO border/bg/
// vertical-padding — the base `footer` rule (globals.css, issue #149) already
// owns border-top, py, and top margin; re-adding them here would double the
// border. Horizontal padding + max-width come from `.container-content`. On
// mobile the columns stack vertically with a divider between them (border-t on
// the 2nd/3rd column); the grid drops those dividers at md+.
const Footer = () => (
  <footer>
    <div className="container-content">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <FooterBrand />

        <div className="border-t border-divider pt-8 md:border-t-0 md:pt-0">
          <FooterExplore />
        </div>

        <div className="border-t border-divider pt-8 md:border-t-0 md:pt-0">
          <FooterCategories />
        </div>
      </div>

      <FooterBottomBar />
    </div>
  </footer>
)

export default Footer
