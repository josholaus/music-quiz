import React from 'react'

import { Title } from './Title'

interface MegaTitleProps {
    className?: string
    children: React.ReactNode
}

const MegaTitle = (props: MegaTitleProps) => (
    <Title className={`${props.className} "text-6xl font-bold"`}>{props.children}</Title>
)

export { MegaTitle }
