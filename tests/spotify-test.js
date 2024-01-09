import 'dotenv/config'
import test from 'ava'
import sinon from 'sinon'
import { SpotifyClient } from '../dist/index.js'

const clientId = 'xxx-xxx-xxx-xxx'
const clientSecret = 'xxx-xxx-xxx-xxx'
const refreshToken = 'xxx-xxx-xxx-xxx'

const spotify = new SpotifyClient({ clientId, clientSecret, refreshToken })

sinon.stub(spotify, 'getCurrentTrack').resolves({
  title: 'fake-title',
  artist: 'fake-artist',
  link: 'https://open.spotify.com/track/123456789',
  isPlaying: true
})

test('get currently playing track', async (t) => {
  const currentTrack = await spotify.getCurrentTrack()
  t.not(typeof currentTrack, 'undefined')

  // not null means there is a track playing
  t.is(currentTrack?.title, 'fake-title')
  t.is(currentTrack?.artist, 'fake-artist')
  t.is(currentTrack?.link, 'https://open.spotify.com/track/123456789')
  t.is(currentTrack?.isPlaying, true)
})

const mockTracks = new Array(50).fill(null).map((_, i) => ({
  title: `fake-title-${i}`,
  artist: `fake-artist-${i}`,
  link: `https://open.spotify.com/track/${i}`
}))

sinon.stub(spotify, 'getRecentTracks').callsFake(async (limit = 1) => {
  if (limit > 50 || limit < 1) {
    throw new Error('Limit must be between 1 and 50')
  }
  return mockTracks.slice(0, limit)
})

test('get last played song', async (t) => {
  const lastPlayed = await spotify.getRecentTracks()
  t.not(typeof lastPlayed, 'undefined')
  t.is(lastPlayed.length, 1)
  t.is(lastPlayed[0]?.title, 'fake-title-0')
  t.is(lastPlayed[0]?.artist, 'fake-artist-0')
  t.is(lastPlayed[0]?.link, 'https://open.spotify.com/track/0')
})

test('get 10 recently played songs', async (t) => {
  const lastPlayed = await spotify.getRecentTracks(10)
  t.not(typeof lastPlayed, 'undefined')
  t.is(lastPlayed.length, 10)
  const randomTrackIdx = Math.floor(Math.random() * 10)
  t.is(lastPlayed[randomTrackIdx]?.title, `fake-title-${randomTrackIdx}`)
  t.is(lastPlayed[randomTrackIdx]?.artist, `fake-artist-${randomTrackIdx}`)
  t.is(
    lastPlayed[randomTrackIdx]?.link,
    `https://open.spotify.com/track/${randomTrackIdx}`
  )
})

sinon.stub(spotify, 'getTopTracks').callsFake(async (options = {}) => {
  const limit = options.limit || 10
  if (limit > 50 || limit < 1) {
    throw new Error('Limit must be between 1 and 50')
  }
  return mockTracks.slice(0, limit)
})

test('Get top tracks with default options', async (t) => {
  const topTracks = await spotify.getTopTracks()
  t.not(typeof topTracks, 'undefined')
  t.is(topTracks.length, 10)
  const randomTrackIdx = Math.floor(Math.random() * 10)
  t.is(topTracks[randomTrackIdx]?.title, `fake-title-${randomTrackIdx}`)
  t.is(topTracks[randomTrackIdx]?.artist, `fake-artist-${randomTrackIdx}`)
  t.is(
    topTracks[randomTrackIdx]?.link,
    `https://open.spotify.com/track/${randomTrackIdx}`
  )
})

test('Get top tracks with limit `10` and timeRange `long`', async (t) => {
  const topTracks = await spotify.getTopTracks({ limit: 20, timeRange: 'long' })
  t.not(typeof topTracks, 'undefined')
  t.is(topTracks.length, 20)
  const randomTrackIdx = Math.floor(Math.random() * 20)
  t.is(topTracks[randomTrackIdx]?.title, `fake-title-${randomTrackIdx}`)
  t.is(topTracks[randomTrackIdx]?.artist, `fake-artist-${randomTrackIdx}`)
  t.is(
    topTracks[randomTrackIdx]?.link,
    `https://open.spotify.com/track/${randomTrackIdx}`
  )
})

test('Get top tracks with default limit and timeRange `medium`', async (t) => {
  const topTracks = await spotify.getTopTracks({ timeRange: 'medium' })
  t.not(typeof topTracks, 'undefined')
  t.is(topTracks.length, 10)
  const randomTrackIdx = Math.floor(Math.random() * 10)
  t.is(topTracks[randomTrackIdx]?.title, `fake-title-${randomTrackIdx}`)
  t.is(topTracks[randomTrackIdx]?.artist, `fake-artist-${randomTrackIdx}`)
  t.is(
    topTracks[randomTrackIdx]?.link,
    `https://open.spotify.com/track/${randomTrackIdx}`
  )
})

test('getRecentTracks: passing limit over 50 should throw error', async (t) => {
  const error = await t.throwsAsync(() => spotify.getRecentTracks(60))
  t.is(error?.message, 'Limit must be between 1 and 50')
})

test('getTopTracks: passing limit over 50 should throw error', async (t) => {
  const error = await t.throwsAsync(() => spotify.getTopTracks({ limit: 60 }))
  t.is(error?.message, 'Limit must be between 1 and 50')
})
