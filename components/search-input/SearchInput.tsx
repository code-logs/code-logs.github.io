import { Search } from 'lucide-react'

export interface SearchInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'type'> {}

const SearchInput = (props: SearchInputProps) => {
  return (
    <label className="inline-flex w-full">
      <Search className="text-text-heading m-auto" />
      <input
        className="flex-1 border-none bg-bg-page outline-none p-1 text-text-body"
        {...props}
        spellCheck={false}
      />
    </label>
  )
}

export default SearchInput
