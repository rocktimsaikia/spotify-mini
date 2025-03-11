# spotify-mini

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/rocktimsaikia/spotify-mini/main.yml)
![npm](https://img.shields.io/npm/v/spotify-mini?style=flat-square&color=success&logo=npm)

Simple Spotify client for nodejs exposing useful methods

> I was using a basic version of this library on my [website](https://www.rocktimsaikia.dev/) for a long time, which led me to transform it into a fully-fledged module.

## Prerequisite

Make sure to create a `refresh_token` with atleast the following permissions enabled:

1. `user-read-currently-playing`
2. `user-read-recently-played`
3. `user-top-read`

> :bulb: You can use [spotify-rtoken-cli](https://github.com/rocktimsaikia/spotify-rtoken-cli) to easily create a `refresh_token` right from your terminal.

## Installation

```sh
# Install with npm
npm install spotify-mini

# Install with yarn
yarn add spotify-mini

# Install with pnpm
pnpm add spotify-mini
```

## Usage

```javascript
import { SpotifyClient } from 'spotify-mini'

const spotify = new SpotifyClient({
  clientId: '<YOUR-SPOTIFY-CLIENT-ID>',
  clientSecret: '<YOUR-SPOTIFY-CLIENT_SECRET>',
  refreshToken: '<YOUR-SPOTIFY-REFRESH-TOKEN>'
})

// Get the currently playing track.
const currentlyPlayingTrack = await spotify.getCurrentTrack()

console.log(currentlyPlayingTrack)
```

Example output:

```javascript
 {
    isPlaying: true,
    title: '<track title>',
    artist: '<artist name>',
    album: '<album name>',
 }
```

## API

#### getCurrentTrack

Get the currently playing track.

| Options                | Type    | Description                                                                       |
| ---------------------- | ------- | --------------------------------------------------------------------------------- |
| `fallbackToLastPlayed` | boolean | Returns the last played track, if there is no ongoing track atm. (default:`true`) |

#### getRecentTracks

Get the recently played tracks.

| Options | Type                  | Description                                                          |
| ------- | --------------------- | -------------------------------------------------------------------- |
| `limit` | number (1 <= n <= 50) | Limit the number of recently played tracks to return. (default: `1`) |

#### getTopTracks

Get the top tracks of the user.

| Options     | Type                | Description                                                                  |
| ----------- | ------------------- | ---------------------------------------------------------------------------- |
| `limit`     | number              | Limit the number of recently played tracks to return. (Default: `10`)        |
| `timeRange` | short, medium, long | Over what time range the top tracks should be calculated. (Default: `short`) |

## Related

- [spotify-rtoken-cli](https://github.com/rocktimsaikia/spotify-rtoken-cli) - Generate Spotify `refresh_token` right from terminal

## License

[MIT](./LICENSE) License &copy; [ Rocktim Saikia ](https://github.com/rocktimsaikia) 2025
