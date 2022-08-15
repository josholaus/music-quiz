# music-quiz

A React/Next app for playing Spotify music quiz. Great for use with friends on a party.

**Warning:** Unfortunately, Spotify does not allow the creation of Spotify games via their [Developer policy](https://developer.spotify.com/policy/). Thus, we cannot provide public access to the music-quiz instance running on quiz.josholaus.com (you will receive an error on login)

If you want to use this app anyway (thank you!) you can register your own Spotify application use the provided Docker image to host music-quiz yourself.

## Creating a Spotify application

1. Head over to [developer.spotify.com](https://developer.spotify.com/dashboard/applications) and log in.
2. Click on "Create an app"
3. Enter a name and a description, agree to the ToS and click "Create"
4. Write down the Client ID and Client Secret (hidden behind the button "Show Client Secret") — you will need it later
5. Click on "Edit Settings" and add `https://<your host>/api/callback` as a redirect URI
6. (optional) Invite your friends to use the app by adding their Spotify email in "Users and Access"

## Installation

We offer a pre-built Docker image through [GitHub's package registry](https://github.com/josholaus/music-quiz/packages/).

**Docker Command**

```shell
docker pull ghcr.io/josholaus/music-quiz/quiz:latest
docker run -d -p 3000:3000 josholaus/music-quiz/quiz:latest
```

**docker-compose**

```yml
version: '2'

services:
  musicquiz:
    container_name: musicquiz
    image: ghcr.io/josholaus/music-quiz/quiz:latest
    ports:
      - '3000'
    environment:
      CLIENT_ID: <your client ID>
      CLIENT_SECRET: <your client secret>
      REDIRECT_URI: https://<your host>/api/callback
    restart: always
```

... and give it a `docker-compose up -d`

## License

This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/).
