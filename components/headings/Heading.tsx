import React from 'react'

interface HeadingProps {
    className?: string
    children: React.ReactNode
}

const Heading = (props: HeadingProps) => <h1 className={`${props.className} text-xl font-light`}>{props.children}</h1>

export { Heading }
