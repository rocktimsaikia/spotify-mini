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
import { SpotifyClient } from 'spotify-mini';

const spotify = new SpotifyClient({
  clientId: '<YOUR-SPOTIFY-CLIENT-ID>',
  clientSecret: '<YOUR-SPOTIFY-CLIENT_SECRET>',
  refreshToken: '<YOUR-SPOTIFY-REFRESH-TOKEN>'
});

// Get the currently playing track,(if there is no track playing, it will return the last played track)
const currentlyPlayingTrack = await spotify.getCurrentlyPlaying();
/**
 {
    isPlaying: true,
    title: '<track title>',
    artist: '<artist name>',
    album: '<album name>',
 }
*/

// Get the last played track
const lastPlayedTrack = await spotify.getLastPlayed();
/**
 [
    {
      title: '<track title>',
      artist: '<artist name>',
      album: '<album name>',
   }
 ]
*/

// To get a specific number of the recently played songs, just pass it to the method (1 < n < 50), default is 1
const recentTracks = await spotify.getLastPlayed(2);
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

### `SpotifyClient`

The exported class that needs to be instanciated to interact with the exposed APIs.

### `getCurrentlyPlaying`

Returns your currently playing track, if none returns null.

**Options**:  
`fallbackToLastPlayed`: (default: true) returns the last played track if there is no currently playing track, setting it to `false` will return null

### `getLastPlayed`

Returns your last played track. But can be used to get a list of your recently played tracks; accepts an optional integer as argument to get your desired number of recently played tracks. (default: 1) (limit is 1<n<50 )

## Development

Create a `.env` file with the properties of `.env.example`.
To run the tests, you will need to generate a `refresh_token` with the minium of the following spotify api scopes: `user-read-currently-playing`, `user-read-recently-played`.

## License

[MIT](https://choosealicense.com/licenses/mit/) Rocktim Saikia &copy; 2022
