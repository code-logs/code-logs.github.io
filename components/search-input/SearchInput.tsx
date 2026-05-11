import { Search } from 'lucide-react'
import styles from './SearchInput.module.scss'

export interface SearchInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'type'> {}

const SearchInput = (props: SearchInputProps) => {
  return (
    <label className={styles.label}>
      <Search className={styles.icon} />
      <input className={styles.input} {...props} spellCheck={false} />
    </label>
  )
}

export default SearchInput
