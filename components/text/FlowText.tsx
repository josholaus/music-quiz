import React from 'react'

interface FlowTextProps {
    className?: string
    children: React.ReactNode
}

const FlowText = (props: FlowTextProps) => <p className={`${props.className}`}>{props.children}</p>

export { FlowText }
