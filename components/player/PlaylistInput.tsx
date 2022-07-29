import React from 'react'

interface PlaylistInputProps {
    values?: string
    callback: (value: string) => void
}

const PlaylistInput = (props: PlaylistInputProps) => {
    let value = props.values ?? ''

    return (
        <>
            <p className="my-3">Please enter the playlist URLs separated by newlines:</p>
            <textarea
                placeholder="Playlist URLs"
                className="w-full p-3 border border-gray-500 rounded-sm"
                defaultValue={props.values}
                onChange={(event) => (value = event.target.value)}
            />
            <button
                className="bg-green-300 mx-auto mt-5"
                onClick={(event) => {
                    event.preventDefault()
                    props.callback(value)
                }}>
                Submit
            </button>
        </>
    )
}
