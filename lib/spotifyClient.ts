const BASE_URL = 'https://api.spotify.com/v1'

class SpotifyClient {
    constructor(private accessToken: string) {}

    public async playRandomTrack(tracks: SpotifyApi.TrackObjectFull[], deviceId: string, offset?: number) {
        const index = Math.floor(Math.random() * tracks.length)
        const track = tracks[index]
        tracks.splice(index, 1) // remove the track so it is not played again
        return this.playTrack(track, deviceId, offset)
    }

    public async playTrack(track: SpotifyApi.TrackObjectFull, deviceId: string, offset?: number) {
        return fetch(`${BASE_URL}/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: [track.uri],
                position_ms: offset ?? 0,
            }),
        })
    }

    public async getPlaylistTracks(playlistId: string): Promise<SpotifyApi.PlaylistTrackObject[]> {
        const res = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        }).then((res) => res.json())
        if (res.next) {
            return [...res.items, ...(await this.getMorePlaylistTracks(res.next))]
        }
        return res.items
    }

    private async getMorePlaylistTracks(url: string): Promise<SpotifyApi.PlaylistTrackObject[]> {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        }).then((res) => res.json())
        if (res.next) {
            return [...res.items, ...(await this.getMorePlaylistTracks(res.next))]
        }
        return res.items
    }
}

export default SpotifyClient
