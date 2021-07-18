
import React from 'react'

export default function Button(props: any) {
	return (
		<a
			href={props.link ? props.link : '#'}
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