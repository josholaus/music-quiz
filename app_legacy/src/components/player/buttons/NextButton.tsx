import React, { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface NextButtonProperties {
	action: () => void
}

export default function NextButton(props: NextButtonProperties) {
	const { t } = useTranslation()

	const action = (event: MouseEvent) => {
		event.preventDefault()
		props.action()
	}

	return (
		<a
			href="/"
			onClick={(event) => action(event)}
			title={t('pages.player.controller.next')}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-10 w-10"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
					clipRule="evenodd"
				/>
			</svg>
		</a>
	)
}
