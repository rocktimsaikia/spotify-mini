import test from 'ava'
import { SpotifyClient } from '../dist/index.js'

const newClient = () =>
  new SpotifyClient({
    clientId: 'xxx-xxx-xxx-xxx',
    clientSecret: 'xxx-xxx-xxx-xxx',
    refreshToken: 'xxx-xxx-xxx-xxx'
  })

const json = (data, status = 200) => new Response(JSON.stringify(data), { status })

const track = (i) => ({
  name: `fake-title-${i}`,
  artists: [{ name: `fake-artist-${i}` }],
  external_urls: { spotify: `https://open.spotify.com/track/${i}` }
})

const routes = {
  token: () => json({ access_token: 'fake-access-token' }),
  currentlyPlaying: () => json({ item: track(0) }),
  recentlyPlayed: (limit) =>
    json({ items: Array.from({ length: limit }, (_, i) => ({ track: track(i) })) }),
  topTracks: (limit) => json({ items: Array.from({ length: limit }, (_, i) => track(i)) })
}

// ponytail: fake Spotify API is a URL-routed fetch stub; swap `overrides` per test
// instead of running a mock http server
let overrides = {}
let lastUrl = ''
globalThis.fetch = async (url) => {
  lastUrl = String(url)
  const limit = Number(new URL(lastUrl).searchParams.get('limit')) || 1
  if (lastUrl.includes('accounts.spotify.com/api/token'))
    return (overrides.token ?? routes.token)()
  if (lastUrl.includes('/currently-playing'))
    return (overrides.currentlyPlaying ?? routes.currentlyPlaying)()
  if (lastUrl.includes('/recently-played'))
    return (overrides.recentlyPlayed ?? routes.recentlyPlayed)(limit)
  if (lastUrl.includes('/top/tracks'))
    return (overrides.topTracks ?? routes.topTracks)(limit)
  throw new Error(`Unexpected fetch: ${lastUrl}`)
}

test.serial.beforeEach(() => {
  overrides = {}
})

test.serial('get currently playing track', async (t) => {
  const currentTrack = await newClient().getCurrentTrack()
  t.deepEqual(currentTrack, {
    isPlaying: true,
    title: 'fake-title-0',
    artist: 'fake-artist-0',
    link: 'https://open.spotify.com/track/0'
  })
})

test.serial('falls back to last played track when nothing is playing', async (t) => {
  overrides.currentlyPlaying = () => new Response(null, { status: 204 })
  const currentTrack = await newClient().getCurrentTrack()
  t.deepEqual(currentTrack, {
    isPlaying: false,
    title: 'fake-title-0',
    artist: 'fake-artist-0',
    link: 'https://open.spotify.com/track/0'
  })
})

test.serial(
  'returns null when nothing is playing and fallback is disabled',
  async (t) => {
    overrides.currentlyPlaying = () => new Response(null, { status: 204 })
    const currentTrack = await newClient().getCurrentTrack({
      fallbackToLastPlayed: false
    })
    t.is(currentTrack, null)
  }
)

test.serial('regenerates the access token on 401 and retries', async (t) => {
  let playingCalls = 0
  let tokenCalls = 0
  overrides.token = () => {
    tokenCalls++
    return routes.token()
  }
  overrides.currentlyPlaying = () =>
    ++playingCalls === 1 ? new Response(null, { status: 401 }) : routes.currentlyPlaying()

  const currentTrack = await newClient().getCurrentTrack()
  t.is(currentTrack?.title, 'fake-title-0')
  t.is(tokenCalls, 2)
})

test.serial('get last played song', async (t) => {
  const lastPlayed = await newClient().getRecentTracks()
  t.is(lastPlayed.length, 1)
  t.deepEqual(lastPlayed[0], {
    title: 'fake-title-0',
    artist: 'fake-artist-0',
    link: 'https://open.spotify.com/track/0'
  })
})

test.serial('get 10 recently played songs', async (t) => {
  const lastPlayed = await newClient().getRecentTracks(10)
  t.is(lastPlayed.length, 10)
  t.is(lastPlayed[9]?.title, 'fake-title-9')
  t.true(lastUrl.includes('limit=10'))
})

test.serial('get top tracks with default options', async (t) => {
  const topTracks = await newClient().getTopTracks()
  t.is(topTracks.length, 10)
  t.deepEqual(topTracks[0], {
    title: 'fake-title-0',
    artist: 'fake-artist-0',
    link: 'https://open.spotify.com/track/0'
  })
  t.true(lastUrl.includes('time_range=short_term'))
})

test.serial('get top tracks with limit `20` and timeRange `long`', async (t) => {
  const topTracks = await newClient().getTopTracks({ limit: 20, timeRange: 'long' })
  t.is(topTracks.length, 20)
  t.true(lastUrl.includes('time_range=long_term'))
  t.true(lastUrl.includes('limit=20'))
})

test.serial('getRecentTracks: passing limit over 50 should throw error', async (t) => {
  await t.throwsAsync(() => newClient().getRecentTracks(60), {
    message: /Limit must be between 1 and 50/
  })
})

test.serial('getTopTracks: passing limit over 50 should throw error', async (t) => {
  await t.throwsAsync(() => newClient().getTopTracks({ limit: 60 }), {
    message: /Limit must be between 1 and 50/
  })
})
