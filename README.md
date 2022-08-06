# music-quiz

A React app for playing Spotify music quiz. Great for use with friends on a party.

**Warning:** This app is currently in closed beta mode, you have to be invited in order to use it. It's also still very buggy — if you still want to use it though, you can read the next section on how to set up your own instance of the app using Docker.

## Installation

This repository offers a built Docker image through [GitHub's package registry](https://github.com/josholaus/music-quiz/packages/), so if you are just looking to set up your own instance of Music Quiz, you can use that.

```
docker pull ghcr.io/josholaus/music-quiz/quiz:latest
docker run -d -p 3000:3000 josholaus/music-quiz/quiz:latest
```

## License

This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/).
