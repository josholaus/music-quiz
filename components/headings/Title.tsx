import React from 'react'

interface TitleProps {
    className?: string
    children: React.ReactNode
}

const Title = (props: TitleProps) => <p className={`${props.className} text-4xl font-bold`}>{props.children}</p>

export { Title }
