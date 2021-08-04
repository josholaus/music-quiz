# music-quiz

Josholaus music quiz app, currently in closed access mode.

**Warning:** This app is currently in closed beta mode, you have to be invited in order to use it. Otherwise you will receive an error on playback.

## Installation

Clone the repository

```shell
git clone https://github.com/Josholaus/music-quiz
```

Install dependencies

```shell
cd ./app && npm install && cd ../server && npm install && cd ..
```

Register an application in the [Spotify developer dashboard](https://developer.spotify.com/dashboard/login). Then insert `CLIENT_ID`, `CLIENT_SECRET` and `REDIRECT_URI` in a newly created .env file in `/server/`.

And finally, run the app (with backend).

```shell
cd ./app & npm run build && cd ../server && npm run start
```

Or just the frontend (this might be what you want if you want to work on the frontend):

```
cd ./app && npm run start
```

## Build

This repository offers a built Docker image through [GitHub's package registry](https://github.com/josholaus/music-quiz/packages/), so if you are just looking to set up your own instance of Music Quiz, you can use that.

```
docker pull ghcr.io/josholaus/music-quiz/quiz:latest
docker run -d -p 8000:8000 josholaus/music-quiz/quiz:latest
```

If you want to build your own image however, you can use the Dockerfile of this repository to build it:

```shell
docker build -t music-quiz .
```

## License

This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/).
