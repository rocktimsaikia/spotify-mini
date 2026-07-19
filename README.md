# spotify-mini

![CI](https://github.com/rocktimsaikia/spotify-mini/actions/workflows/main.yml/badge.svg)
![npm](https://badgen.net/npm/v/spotify-mini)

Fetch your currently playing, recent and top Spotify tracks in Node.js

## Installation

Requires Node.js 18 or later. Ships with TypeScript types.

```sh
npm install spotify-mini
```

## Usage

Requires a Spotify `refresh_token` with at least the `user-read-currently-playing`, `user-read-recently-played` and `user-top-read` scopes. You can generate one right from your terminal with [spotify-rtoken-cli](https://github.com/rocktimsaikia/spotify-rtoken-cli).

```javascript
import { SpotifyClient } from 'spotify-mini'

const spotify = new SpotifyClient({
  clientId: '<YOUR-SPOTIFY-CLIENT-ID>',
  clientSecret: '<YOUR-SPOTIFY-CLIENT-SECRET>',
  refreshToken: '<YOUR-SPOTIFY-REFRESH-TOKEN>'
})

const currentTrack = await spotify.getCurrentTrack()

console.log(currentTrack)
```

Output:

```javascript
{
  isPlaying: true,
  title: '<track title>',
  artist: '<artist name>',
  link: '<spotify track url>'
}
```

## Options

### getCurrentTrack

Get the currently playing track. Pass an options object as the first argument:

```javascript
await spotify.getCurrentTrack({ fallbackToLastPlayed: false })
```

| Option                 | Required | Default | Description                                                    |
| ---------------------- | -------- | ------- | -------------------------------------------------------------- |
| `fallbackToLastPlayed` | No       | `true`  | Return the last played track if no track is currently playing. |

### getRecentTracks

Get the recently played tracks. Pass the limit as the first argument:

```javascript
await spotify.getRecentTracks(10)
```

| Option  | Required | Default | Description                                           |
| ------- | -------- | ------- | ----------------------------------------------------- |
| `limit` | No       | `1`     | Number of recently played tracks to return (1 to 50). |

### getTopTracks

Get your top tracks. Pass an options object as the first argument:

```javascript
await spotify.getTopTracks({ limit: 20, timeRange: 'long' })
```

| Option      | Required | Default   | Description                                                               |
| ----------- | -------- | --------- | ------------------------------------------------------------------------- |
| `limit`     | No       | `10`      | Number of top tracks to return (1 to 50).                                 |
| `timeRange` | No       | `'short'` | Time range the top tracks are calculated over: `short`, `medium`, `long`. |

## Related

- [**spotify-rtoken-cli**](https://github.com/rocktimsaikia/spotify-rtoken-cli): Generate Spotify refresh_token right from terminal.

## License

MIT 2022-2026 &copy; [Rocktim Saikia](https://rocktim.dev)
