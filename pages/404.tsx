import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import { Title, Heading } from '@components/headings/'

const NotFound: NextPage = () => (
    <>
        <Head>
            <title>404 - Josholaus</title>
            <meta name="description" content="Josholaus Music Quiz - Reached a dead end you twat" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
            <Title>404</Title>
            <Heading className="mt-1">Sorry, looks like you&apos;ve reached a dead end! :(</Heading>
        </div>
    </>
)

export default NotFound
