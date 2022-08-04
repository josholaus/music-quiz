import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { SpotifyPlayer } from './SpotifyPlayer'

const WebPlaybackSDKReadyContext = createContext<boolean | undefined>(undefined)

interface ProviderProps {
    children?: ReactNode
}

function WebPlaybackSDKReadyProvider({ children }: ProviderProps) {
    const [webPlaybackSDKReady, setWebPlaybackSDKReady] = useState(false)
    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            setWebPlaybackSDKReady(true)
        }
    }, [])
    return (
        <WebPlaybackSDKReadyContext.Provider value={webPlaybackSDKReady}>
            {children}
        </WebPlaybackSDKReadyContext.Provider>
    )
}

export function useWebPlaybackSDKReady() {
    const value = useContext(WebPlaybackSDKReadyContext)
    if (value === undefined) {
        throw new Error('Can only use webPlaybackSDKReady hook inside WebPlaybackSDKReadyProvider')
    }
    return value
}

interface SDKProps {
    accessToken: string
    refreshToken: string
}

export function WebPlaybackSDK(props: SDKProps) {
    useEffect(() => {
        const scriptTag = document.createElement('script')
        scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'
        document.body.appendChild(scriptTag)
        return () => {
            document.body.removeChild(scriptTag)
        }
    }, [])
    return (
        <WebPlaybackSDKReadyProvider>
            <SpotifyPlayer {...props} />
        </WebPlaybackSDKReadyProvider>
    )
}
