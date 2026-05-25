export interface SectionHeaderProps {
  title: string
  // When omitted the "View all →" link is not rendered.
  viewAllHref?: string
}

// Reusable section heading for Recent / Categories / Tags sections.
// The base h2 rule sets text-3xl; we override to text-2xl per design spec.
const SectionHeader = ({ title, viewAllHref }: SectionHeaderProps) => (
  <header className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-semibold text-text-heading m-0">{title}</h2>

    {viewAllHref && (
      <a
        href={viewAllHref}
        className="text-sm font-medium text-link hover:text-link-hover transition-colors"
      >
        View all →
      </a>
    )}
  </header>
)

export default SectionHeader
