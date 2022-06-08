import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Title, Subheading } from '../components'

export default function NotFoundPage() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>{t('pages.404.helmet.title')}</title>
			</Helmet>
			<Title>{t('pages.404.title')}</Title>
			<Subheading className="mt-1">{t('pages.404.subtitle')}</Subheading>
		</>
	)
}
