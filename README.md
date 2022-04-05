# spotify-mini

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/rocktimsaikia/spotify-mini/tests/main?style=flat-square&logo=github&color=success)
![npm](https://img.shields.io/npm/v/spotify-mini?style=flat-square&color=success&logo=npm)

A simple node wrapper around the [Spotify web api](https://developer.spotify.com/documentation/web-api/) that exposes some useful methods like easily getting your currently playing track, last played track or both.

> I have been using a rough version of this lib in my [portfolio](https://www.rocktimsaikia.com/) from the very begining, so finally decided to turn it into a proper npm module.

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
```

<br/>

## API

#### `getCurrentTrack`

| Options                | Type    | Description                                                                       |
| ---------------------- | ------- | --------------------------------------------------------------------------------- |
| `fallbackToLastPlayed` | boolean | Returns the last played track, if there is no ongoing track atm. (default:`true`) |

#### `getRecentTracks`

| Options | Type                  | Description                                                          |
| ------- | --------------------- | -------------------------------------------------------------------- |
| `limit` | number (1 <= n <= 50) | Limit the number of recently played tracks to return. (default: `1`) |

#### `getTopTracks`

| Options     | Type                | Description                                                                  |
| ----------- | ------------------- | ---------------------------------------------------------------------------- |
| `limit`     | number              | Limit the number of recently played tracks to return. (Default: `10`)        |
| `timeRange` | short, medium, long | Over what time range the top tracks should be calculated. (Default: `short`) |

## License

[MIT](https://choosealicense.com/licenses/mit/) Rocktim Saikia &copy; 2022
