# spotify-mini

![npm](https://img.shields.io/npm/v/spotify-mini?style=flat-square&color=success&logo=npm)

> A simple node wrapper around the [Spotify web api](https://developer.spotify.com/documentation/web-api/) that exposes two methods to get the currently playing and the last played track.<br/>

I have been using a rough version of this lib in my [portfolio's spotify widget](https://rocktimcodes.site) from the very begining, so finally decided to turn it into a proper npm module.

<br/>

## Installation

```bash
yarn add meta-fetcher
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

// Get the currently playing track,(if there is no track playing, it will return null)
const currentlyPlayingSong = await spotify.getCurrentlyPlaying();

// Get the last played track
const lastPlayedTrack = await spotify.getLastPlayedTrack();

// The track format is:
/**
 {
    title: '<track title>',
    artist: '<artist name>',
    album: '<album name>',
 }
* /
```

<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/) Rocktim Saikia &copy; 2022
