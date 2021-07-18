import React from 'react'

export default function Title(props: any) {
	return (
		<h1 className={`${props.className} text-4xl font-extrabold uppercase`}>
			{props.children}
		</h1>
	)
}
