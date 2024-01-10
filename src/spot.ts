// This file is used for quick testing and debugging the SpotifyClient class
// Example usage: `tsx spot.ts`

import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })
import { SpotifyClient } from './index'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN as string

console.table({
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
})

const spotify = new SpotifyClient({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  refreshToken: SPOTIFY_REFRESH_TOKEN
})

const currentSong = await spotify.getCurrentTrack()

console.log(currentSong)
