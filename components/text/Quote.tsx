import React from 'react'

interface QuoteProps {
    className?: string
    children: React.ReactNode
    author?: string
}

const Quote = (props: QuoteProps) => (
    <div className={`${props.className} text-slate-600`}>
        <p className="italic">
            {'>'} &quot;{props.children}
        </p>
        <p>~ {props.author}</p>
    </div>
)

export { Quote }
