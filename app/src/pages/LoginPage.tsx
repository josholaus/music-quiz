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
			<p className="text-opacity-70 my-2 w-8/12 mx-auto">
				<span className="font-bold">Please note:</span> This app is
				still in closed beta mode. You cannot use the login button below
				unless you have been invited by Josh or Nicolaus.
			</p>
			<SpotifyLoginButton className="mt-5 mx-auto" link="/login">
				{t('pages.main.login')}
			</SpotifyLoginButton>
		</>
	)
}
