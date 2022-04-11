import { Album, Artist, ExternalID, ExternalUrl } from 'spotify-types'

export interface TopTracks {
  href: string
  items: Item[]
  limit: number
  next: string
  offset: number
  previous: string
  total: number
}

export interface Item {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalID
  external_urls: ExternalUrl
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}
