const BASE_URL = 'https://api.spotify.com/v1'

class SpotifyClient {
    constructor(private accessToken: string, private deviceId: string) {}
    public async playTrack(track: Spotify.Track, offset?: number) {
        return fetch(`${BASE_URL}/me/player/play?device_id=${this.deviceId}`, {
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
}

export default SpotifyClient
