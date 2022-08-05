import type { NextPage } from 'next'
import Head from 'next/head'

import { Title } from '@components/headings/'

const NotFound: NextPage = () => (
    <>
        <Head>
            <title>404 - Josholaus Music Quiz</title>
        </Head>
        <div>
            <Title>404</Title>
            <p>It looks like you have reached a dead end</p>
        </div>
    </>
)

export default NotFound
