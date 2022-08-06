import React from 'react'

interface GeneralButtonProps {
    className?: string
    children?: React.ReactNode
    onClick: () => void
}

const GeneralButton = (props: GeneralButtonProps) => (
    <button
        onClick={() => props.onClick()}
        className={`${props.className} flex mx-auto items-center justify-center font-semibold bg-sky-500 hover:bg-sky-400 text-white w-auto transition-colors rounded-lg shadow-sm py-2 px-6 h-12`}>
        <span>{props.children}</span>
    </button>
)

export { GeneralButton }
