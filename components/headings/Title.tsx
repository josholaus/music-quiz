import React from 'react'

interface TitleProps {
    className?: string
    children: React.ReactNode
}

const Title = (props: TitleProps) => <h1 className={`${props.className} text-4xl font-bold`}>{props.children}</h1>

export { Title }
