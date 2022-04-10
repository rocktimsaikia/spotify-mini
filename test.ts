import 'dotenv/config'
import test from 'ava'
import { SpotifyClient } from './dist/index.js'

const clientId = process.env.SPOTIFY_CLIENT_ID as string
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN as string

const spotify = new SpotifyClient({ clientId, clientSecret, refreshToken })

test('get currently playing track', async (t) => {
  const currentTrack = await spotify.getCurrentTrack()
  t.truthy(typeof currentTrack !== 'undefined')

  if (currentTrack !== null) {
    // not null means there is a track playing
    t.truthy(typeof currentTrack?.title === 'string')
    t.truthy(typeof currentTrack?.artist === 'string')
    t.truthy(typeof currentTrack?.link === 'string')
    t.truthy(typeof currentTrack?.isPlaying === 'boolean')
    t.truthy(currentTrack?.title?.length > 0)
    t.truthy(currentTrack?.artist?.length > 0)
    t.truthy(currentTrack?.link?.length > 0)
  }
})

test('get last played song', async (t) => {
  const lastPlayed = await spotify.getRecentTracks()
  t.truthy(typeof lastPlayed !== 'undefined')

  t.truthy(typeof lastPlayed[0]?.title === 'string')
  t.truthy(typeof lastPlayed[0]?.artist === 'string')
  t.truthy(typeof lastPlayed[0]?.link === 'string')
  t.truthy(lastPlayed[0]?.title?.length > 0)
  t.truthy(lastPlayed[0]?.artist?.length > 0)
  t.truthy(lastPlayed[0]?.link?.length > 0)
})

test('get 10 recently played songs', async (t) => {
  const lastPlayed = await spotify.getRecentTracks(10)
  t.truthy(typeof lastPlayed !== 'undefined')

  t.truthy(lastPlayed.length === 10)
  lastPlayed.forEach((track) => {
    t.truthy(typeof track?.title === 'string')
    t.truthy(typeof track?.artist === 'string')
    t.truthy(typeof track?.link === 'string')
    t.truthy(track?.title?.length > 0)
    t.truthy(track?.artist?.length > 0)
    t.truthy(track?.link?.length > 0)
  })
})

test('Get top tracks with default options', async (t) => {
  const topTracks = await spotify.getTopTracks()
  t.truthy(typeof topTracks !== 'undefined')

  t.truthy(topTracks.length === 10)
  topTracks.forEach((track) => {
    t.truthy(typeof track?.title === 'string')
    t.truthy(typeof track?.artist === 'string')
    t.truthy(typeof track?.link === 'string')
    t.truthy(track?.title?.length > 0)
    t.truthy(track?.artist?.length > 0)
    t.truthy(track?.link?.length > 0)
  })
})

test('Get top tracks with limit `10` and timeRange `long`', async (t) => {
  const topTracks = await spotify.getTopTracks({ limit: 20, timeRange: 'long' })
  t.truthy(typeof topTracks !== 'undefined')

  t.truthy(topTracks.length === 20)
  topTracks.forEach((track) => {
    t.truthy(typeof track?.title === 'string')
    t.truthy(typeof track?.artist === 'string')
    t.truthy(typeof track?.link === 'string')
    t.truthy(track?.title?.length > 0)
    t.truthy(track?.artist?.length > 0)
    t.truthy(track?.link?.length > 0)
  })
})

test('Get top tracks with default limit and timeRange `medium`', async (t) => {
  const topTracks = await spotify.getTopTracks({ timeRange: 'medium' })
  t.truthy(typeof topTracks !== 'undefined')

  t.truthy(topTracks.length === 10)
  topTracks.forEach((track) => {
    t.truthy(typeof track?.title === 'string')
    t.truthy(typeof track?.artist === 'string')
    t.truthy(typeof track?.link === 'string')
    t.truthy(track?.title?.length > 0)
    t.truthy(track?.artist?.length > 0)
    t.truthy(track?.link?.length > 0)
  })
})

test('getRecentTracks: passing limit over 50 should throw error', async (t) => {
  await t.throwsAsync(spotify.getRecentTracks(60))
})
test('getTopTracks: passing limit over 50 should throw error', async (t) => {
  await t.throwsAsync(spotify.getTopTracks({ limit: 60 }))
})
