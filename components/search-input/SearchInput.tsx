import { Search } from 'lucide-react'

export interface SearchInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'type'> {}

const SearchInput = (props: SearchInputProps) => {
  return (
    <label className="inline-flex w-full">
      <Search className="text-theme-dark m-auto" />
      <input
        className="flex-1 border-none bg-theme-bg outline-none p-narrow text-theme-font"
        {...props}
        spellCheck={false}
      />
    </label>
  )
}

export default SearchInput
