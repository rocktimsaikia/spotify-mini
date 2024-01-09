export interface ResponseTrack {
  title: string
  artist: string
  link: string
}

export interface SpotifyClientOptions {
  clientId: string
  clientSecret: string
  refreshToken: string
}

export interface CurrentlyPlayingOptions {
  fallbackToLastPlayed?: boolean
}

export interface TopItemsOptions {
  limit?: number
  timeRange?: 'long' | 'medium' | 'short'
}

export interface CurrentlyPlayingResponse extends ResponseTrack {
  isPlaying: boolean
}
