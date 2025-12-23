import { useEffect, useMemo, useRef, useState } from 'react'
import type { FilterOption } from '../../lib/filterOptions'
import styles from './dropdownFilter.module.css'

type DropdownFilterProps = {
    label: string;
    options: FilterOption[];
    value?: string;
    placeholder?: string;
    onChange: (value: string | undefined) => void;
}

function DropdownFilter({
    label,
    options,
    value,
    placeholder,
    onChange,
}: DropdownFilterProps) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const selectedOption = useMemo(
        () => value ? options.find(option => option.value === value) : undefined,
        [options, value],
    )

    const displayLabel = selectedOption?.label ?? placeholder ?? 'Выберите...'

    const handleToggle = () => {
        setOpen(prev => !prev)
    }

    const handleSelect = (nextValue: string) => {
        const normalized = nextValue === '' ? undefined : nextValue
        onChange(normalized)
        setOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) return
            if (containerRef.current.contains(event.target as Node)) return
            setOpen(false)
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    return (
        <div className={styles.wrapper} ref={containerRef}>
            <span className={styles.label}>{label}</span>

            <button
                type="button"
                className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
                onClick={handleToggle}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={styles.triggerText}>{displayLabel}</span>
                <span className={styles.triggerIcon} aria-hidden="true">
                    <span className={styles.chevron} />
                </span>
            </button>

            <div
                className={`${styles.listContainer} ${open ? styles.listOpen : styles.listClosed}`}
            >
                <div
                    className={styles.list}
                    role="listbox"
                >
                    {options.filter(option => option.value !== '').map(option => {
                        const isSelected = option.value === value

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span className={styles.optionLabel}>{option.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DropdownFilter


