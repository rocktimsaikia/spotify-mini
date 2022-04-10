# spotify-mini

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/rocktimsaikia/spotify-mini/tests/main?style=flat-square&logo=github&color=success)
![npm](https://img.shields.io/npm/v/spotify-mini?style=flat-square&color=success&logo=npm)

Simple Spotify client for nodejs exposing useful methods

> I have been using a rough version of this lib in my [portfolio](https://www.rocktimsaikia.com/) from a long time. So decided to turn it into a proper module.

<br/>

## Prerequisite

Make sure to create a `refresh token` with atleast these permissions enabled `user-read-currently-playing`, `user-read-recently-played`, `user-top-read`. You can use [spotify-rtoken-cli](https://github.com/rocktimsaikia/spotify-rtoken-cli) to easily create a `refresh_token` right from your terminal.

<br/>

## Installation

```bash
yarn add spotify-mini
```

<br/>

## Usage

```javascript
import { SpotifyClient } from 'spotify-mini'

const spotify = new SpotifyClient({
  clientId: '<YOUR-SPOTIFY-CLIENT-ID>',
  clientSecret: '<YOUR-SPOTIFY-CLIENT_SECRET>',
  refreshToken: '<YOUR-SPOTIFY-REFRESH-TOKEN>'
})

// Get the currently playing track,(if there is no track playing, it will return the last played track)
const currentlyPlayingTrack = await spotify.getCurrentTrack()
/**
 {
    isPlaying: true,
    title: '<track title>',
    artist: '<artist name>',
    album: '<album name>',
 }
*/

// Get the most recently played tracks in order, default return limit is 1
const lastPlayedTracks = await spotify.getRecentTracks(2)
/**
 [
   {
      title: '<track title>',
      artist: '<artist name>',
      album: '<album name>',
   },
   {
      title: '<track title>',
      artist: '<artist name>',
      album: '<album name>',
   }
 ]
*/

// Get your most played tracks, see API doc below for available options
const topRecentTracks = await spotify.getTopTracks()
const topOverallTracks = await spotify.getTopTracks({ timeRange: 'long' })
```

<br/>

## API

#### getCurrentTrack

| Options                | Type    | Description                                                                       |
| ---------------------- | ------- | --------------------------------------------------------------------------------- |
| `fallbackToLastPlayed` | boolean | Returns the last played track, if there is no ongoing track atm. (default:`true`) |

#### getRecentTracks

| Options | Type                  | Description                                                          |
| ------- | --------------------- | -------------------------------------------------------------------- |
| `limit` | number (1 <= n <= 50) | Limit the number of recently played tracks to return. (default: `1`) |

#### getTopTracks

| Options     | Type                | Description                                                                  |
| ----------- | ------------------- | ---------------------------------------------------------------------------- |
| `limit`     | number              | Limit the number of recently played tracks to return. (Default: `10`)        |
| `timeRange` | short, medium, long | Over what time range the top tracks should be calculated. (Default: `short`) |

## Related

- [spotify-rtoken-cli](https://github.com/rocktimsaikia/spotify-rtoken-cli) - Generate Spotify `refresh_token` right from terminal

## License

[MIT](./LICENSE) License &copy; [ Rocktim Saikia ](https://github.com/rocktimsaikia) 2022
