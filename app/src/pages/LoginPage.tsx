import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Title, Subheading, SpotifyLoginButton } from '../components'

export default function LoginPage() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>{t('pages.main.helmet.title')}</title>
			</Helmet>
			<Title>{t('pages.main.title')}</Title>
			<Subheading className="mt-1">{t('pages.main.subtitle')}</Subheading>
			<SpotifyLoginButton
				className="mt-5 mx-auto"
				link="http://localhost:8005/login">
				{t('pages.main.login')}
			</SpotifyLoginButton>
		</>
	)
}
