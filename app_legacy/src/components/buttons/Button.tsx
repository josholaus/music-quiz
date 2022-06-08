import React, { EventHandler, MouseEvent } from 'react'

export interface ButtonProperties {
	link?: string
	className?: string
	icon?: JSX.Element
	children: JSX.Element
	onClick?: EventHandler<MouseEvent>
}

export default function Button(props: ButtonProperties) {
	return (
		<a
			href={props.link ? props.link : '#'}
			onClick={props.onClick}
			className={`${props.className} w-80 rounded-full px-4 py-3 flex justify-center shadow-md transition duration-200 ease-in-out`}>
			<div className="flex items-center">
				{props.icon}
				<span className="pl-2 uppercase font-bold tracking-wider text-lg">
					{props.children}
				</span>
			</div>
		</a>
	)
}
