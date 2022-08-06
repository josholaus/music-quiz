import type { AppProps } from 'next/app'
import '../styles/globals.css'

import { AppProvider } from '@components/context'
import { Layout } from '@components/Layout'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AppProvider>
            <Head>
                <title>Josholaus Music Quiz</title>
                <meta name="description" content="Josholaus Music Quiz back at it again lol" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppProvider>
    )
}

export default MyApp
