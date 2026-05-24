import { Search, X } from 'lucide-react'
import { useState } from 'react'

export interface SearchInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'type'> {}

const SearchInput = (props: SearchInputProps) => {
  const { defaultValue, onChange, ...rest } = props
  // Track value locally only to toggle the clear (×) button. The input stays
  // uncontrolled (defaultValue + form submit) — see the form in pages/posts/[page].tsx.
  const [hasValue, setHasValue] = useState(!!defaultValue)

  const clear = () => {
    // Clearing the permanent search means leaving search mode entirely, so
    // navigate back to the unfiltered first page (consistent with form submit).
    location.href = '/posts/1'
  }

  return (
    <div className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-bg-page px-3 transition-[box-shadow,border-color] focus-within:border-accent focus-within:shadow-focus">
      <Search className="text-text-muted shrink-0" size={18} strokeWidth={1.5} />
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={(event) => {
          setHasValue(!!event.currentTarget.value)
          onChange?.(event)
        }}
        spellCheck={false}
        // Wrapper owns the focus ring via focus-within; suppress the input's own
        // global :focus-visible box-shadow to avoid a doubled ring.
        className="flex-1 border-none bg-transparent text-text-body outline-none placeholder:text-text-muted focus-visible:shadow-none [&::-webkit-search-cancel-button]:hidden"
        {...rest}
      />
      {hasValue && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={clear}
          className="shrink-0 text-text-muted hover:text-text-heading"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
