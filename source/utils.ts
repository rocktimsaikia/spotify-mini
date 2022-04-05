import { Track } from 'spotify-types'
import { ResponseTrack } from './types/base'

export const filterTrack = (track: Track): ResponseTrack => ({
  title: track?.name,
  artist: track?.artists?.map((artist) => artist?.name).join(', '),
  link: track?.external_urls.spotify
})

export const encodeToBase64 = (str: string): string => Buffer.from(str).toString('base64')
