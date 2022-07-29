import React from 'react'

import { Title } from './Title'

interface MegaTitleProps {
    children: React.ReactNode
}

const MegaTitle = (props: MegaTitleProps) => (
    <Title className="text-6xl font-bold tracking-widest uppercase drop-shadow-lg">{props.children}</Title>
)

export { MegaTitle }
