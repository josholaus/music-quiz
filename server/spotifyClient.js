const qs = require('qs')
const axios = require('axios')

class SpotifyClient {
	constructor() {
		this.redirect_uri = process.env.REDIRECT_URI
		this.client_id = process.env.CLIENT_ID
		this.client_secret = process.env.CLIENT_SECRET
		this.scopes = [
			'playlist-read-private',
			'streaming',
			'app-remote-control',
			'user-read-playback-state',
			'user-modify-playback-state',
			'user-read-currently-playing',
		].join(' ')
		this.auth_header =
			'Basic ' +
			Buffer.from(this.client_id + ':' + this.client_secret).toString(
				'base64',
			)
	}

	handleLogin(req, res) {
		const url =
			'https://accounts.spotify.com/authorize?' +
			qs.stringify({
				response_type: 'code',
				client_id: this.client_id,
				scope: this.scopes,
				redirect_uri: this.redirect_uri,
			})
		res.redirect(url)
	}
	handleCallback(req, res) {
		const code = req.query.code || null
		const data = qs.stringify({
			code: code,
			redirect_uri: this.redirect_uri,
			grant_type: 'authorization_code',
		})
		const requestOptions = {
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				Authorization: this.auth_header,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': data.length,
			},
			data: data,
		}
		axios(requestOptions)
			.then((response) => {
				const responseData = qs.stringify({
					access_token: response.data.access_token,
					refresh_token: response.data.refresh_token,
				})
				res.redirect('/#' + responseData)
			})
			.catch((err) => {
				const responseData = qs.stringify({
					error: err.response.error,
					error_description: err.response.error_description,
				})
				res.redirect('/#' + responseData)
			})
	}

	handleRefresh(req, res) {
		const refresh_token = req.query.refresh_token
		const data = qs.stringify({
			grant_type: 'refresh_token',
			refresh_token: refresh_token,
		})
		const requestOptions = {
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				Authorization: this.auth_header,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': data.length,
			},
			data: data,
		}
		axios(requestOptions)
			.then((response) => {
				res.send({
					access_token: access_token,
				})
			})
			.catch((err) => {
				res.send({
					error: err.response.error,
					error_description: err.response.error_description,
				})
			})
	}
}

module.exports = SpotifyClient
