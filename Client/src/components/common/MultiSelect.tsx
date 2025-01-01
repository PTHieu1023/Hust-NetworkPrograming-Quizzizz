import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Multiselect from 'multiselect-react-dropdown'

interface MultiSelectProps<T> {
    options: T[]
    onSelect: (selectedList: T[]) => void
    onRemove: (selectedList: T[]) => void
    displayKey: keyof T // Key to display in the dropdown
    tooltipKey?: keyof T // Key to display in the tooltip
    placeholder?: string
    className?: string
}
const MultiSelect = <T extends Record<string, any>>({
    options,
    onSelect,
    onRemove,
    displayKey,
    tooltipKey,
    placeholder = 'Select',
    className = ''
}: MultiSelectProps<T>) => {
    const optionsElements = document.querySelectorAll(
        '.optionContainer .option'
    )
    optionsElements.forEach((el, index) => {
        el.setAttribute('data-tip', options[index][tooltipKey as string])
        el.classList.add('tooltip')
        el.classList.add('w-full')
        el.classList.add('text-start')
    })
    return (
        <div className={`relative w-full max-w-lg mx-auto ${className}`}>
            <Multiselect
                options={options} // Options to display in the dropdown
                onSelect={onSelect} // Function to handle selected items
                onRemove={onRemove} // Function to handle removed items
                displayValue={String(displayKey)} // Dynamic display key
                avoidHighlightFirstOption // Ensure no option is pre-highlighted
                placeholder={placeholder}
            />
            <div className="absolute h-full inset-y-0 right-4 flex justify-center items-center text-primary">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div>
    )
}

export default MultiSelect
