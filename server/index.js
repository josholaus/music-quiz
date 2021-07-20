const dotenv = require('dotenv')
const log4js = require('log4js')
const express = require('express')
const path = require('path')
const minimist = require('minimist')
const spotifyClient = require('./spotifyClient')

function main(args) {
	const parsedArgs = minimist(args.slice(2))
	const debug = parsedArgs['_'].includes('debug')
	dotenv.config({
		path: path.join(__dirname, debug ? '/.env.local' : '/.env'),
		debug: debug,
	})
	process.env.DEBUG = debug
	log4js.configure({
		appenders: {
			console: { type: 'console' },
		},
		categories: {
			default: {
				appenders: ['console'],
				level: process.env.DEBUG ? 'debug' : 'info',
			},
		},
	})
	const logger = log4js.getLogger('Server')
	logger.info(
		'Bootstrapping Music Quiz server, see https://github.com/josholaus/music-quiz for more info',
	)
	const server = express()
	configureMiddleware(server, logger)
	configureRoutes(server)
	const port = process.env.PORT || 8000
	server.listen(port, () => {
		logger.info(`Now listening on http://127.0.0.1:${port}/`)
	})
}

function configureMiddleware(server, logger) {
	server.use(
		log4js.connectLogger(logger, {
			level: 'auto',
			statusRules: [
				{ from: 200, to: 499, level: 'debug' },
				{ from: 500, to: 599, level: 'error' },
			],
		}),
	)
	server.use(express.static(path.join(__dirname, '../app/build')))
}

function configureRoutes(server) {
	const client = new spotifyClient()
	server.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../app/build', 'index.html'))
	})
	// Begin Spotify routes
	server.get('/login', (req, res) => {
		client.handleLogin(req, res)
	})
	server.get('/callback', (req, res) => {
		client.handleCallback(req, res)
	})
	server.get('/refresh_token', (req, res) => {
		client.handleRefresh(req, res)
	})
	// End Spotify routes
	server.get('*', (req, res) => {
		res.status(404).sendFile(
			path.join(__dirname, '../app/build', 'index.html'),
		)
	})
}

main(process.argv)
