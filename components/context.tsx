import { createContext, useContext, useMemo, useState } from 'react'

export const AppContext = createContext(undefined)

export const useGlobalContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('Cannot use global context outside of a provider')
    }
    return context
}

export const AppProvider = (props: any) => {
    const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null)
    const [revealed, setRevealed] = useState(false)
    const value = useMemo(() => ({ currentTrack, setCurrentTrack, revealed, setRevealed }), [currentTrack, revealed])
    return <AppContext.Provider value={value} {...props} />
}
