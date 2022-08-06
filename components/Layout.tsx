import React from 'react'
import { useGlobalContext } from './context'

const Layout = (props: { children: React.ReactNode }) => {
    const {
        revealed,
        currentTrack,
    }: {
        revealed: boolean
        currentTrack: Spotify.Track | null
    } = useGlobalContext()

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className={`flex items-center justify-center h-screen w-screen ${revealed ? '' : 'bg-black'}`}>
                <div className="flex flex-col items-center justify-center md:mx-16 lg:mx-96 w-full h-full md:h-max rounded-none md:rounded-xl p-10 bg-gray-100 text-center shadow-xl">
                    <main>{props.children}</main>
                </div>
            </div>
            <div className={revealed ? 'w-screen h-full absolute -z-10 bg-black overflow-hidden' : 'hidden'}>
                <picture>
                    <img
                        src={currentTrack?.album.images[0].url}
                        alt={currentTrack?.name}
                        className="w-full h-full object-cover scale-110 opacity-70"
                        style={{
                            filter: 'blur(7px)',
                        }}
                    />
                </picture>
            </div>
        </div>
    )
}

export { Layout }
