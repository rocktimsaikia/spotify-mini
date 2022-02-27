import 'dotenv/config';
import test from 'ava';
import { SpotifyClient } from './dist/index.js';

const clientId = process.env.SPOTIFY_CLIENT_ID as string;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN as string;

const spotify = new SpotifyClient({ clientId, clientSecret, refreshToken });

test('SpotifyClient: get currently playing track', async (t) => {
  const currentTrack = await spotify.getCurrentlyPlaying();
  t.truthy(typeof currentTrack !== 'undefined');

  if (currentTrack !== null) {
    // not null means there is a track playing
    t.truthy(typeof currentTrack?.title === 'string');
    t.truthy(typeof currentTrack?.artist === 'string');
    t.truthy(typeof currentTrack?.link === 'string');
    t.truthy(currentTrack?.title?.length > 0);
    t.truthy(currentTrack?.artist?.length > 0);
    t.truthy(currentTrack?.link?.length > 0);
  }
});

test('SpotifyClient: get last played song', async (t) => {
  const lastPlayed = await spotify.getLastPlayed();
  t.truthy(typeof lastPlayed !== 'undefined');

  t.truthy(typeof lastPlayed?.title === 'string');
  t.truthy(typeof lastPlayed?.artist === 'string');
  t.truthy(typeof lastPlayed?.link === 'string');
  t.truthy(lastPlayed?.title?.length > 0);
  t.truthy(lastPlayed?.artist?.length > 0);
  t.truthy(lastPlayed?.link?.length > 0);
});
