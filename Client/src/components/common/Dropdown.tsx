import React from 'react'

interface DropdownProps {
    className?: string
    tabIndex?: number
    tabName?: string
    children?: React.ReactNode
}

const Dropdown: React.FC<DropdownProps> = ({ className = '', tabIndex = 0, tabName = 'tab 1', children, ...props }) => {
    return (
        <div {...props} className={`dropdown ${className}`}>
            <div tabIndex={tabIndex} role="button" className="btn btn-ghost">
                {tabName}
            </div>
            <ul tabIndex={tabIndex} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {children}
            </ul>
        </div>
    )
}

export default Dropdown
