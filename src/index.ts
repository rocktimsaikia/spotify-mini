import fetch from 'node-fetch'
import { stringify } from 'node:querystring'
import { AccessToken, CurrentlyPlaying, RecentlyPlayed, Track } from 'spotify-types'
import {
    CurrentlyPlayingOptions,
    CurrentlyPlayingResponse,
    ResponseTrack,
    SpotifyClientOptions,
    TopItemsOptions
} from './types/base'
import { BaseError, TopTracks } from './types/spotify'
import { encodeToBase64, filterTrack } from './utils'

const ENDPOINTS = {
  accessToken: 'https://accounts.spotify.com/api/token',
  currentlyPlaying: 'https://api.spotify.com/v1/me/player/currently-playing',
  lastPlayed: 'https://api.spotify.com/v1/me/player/recently-played',
  topItems: 'https://api.spotify.com/v1/me/top'
}

export class SpotifyClient {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly refreshToken: string
  private accessToken: string | null = null

  constructor({ clientId, clientSecret, refreshToken }: SpotifyClientOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.refreshToken = refreshToken
  }

  private _genAccesToken = async () => {
    const basicToken = encodeToBase64(`${this.clientId}:${this.clientSecret}`)

    const response = await fetch(ENDPOINTS.accessToken, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    })

    if (!response.ok) {
      const errorData = (await response.json()) as BaseError
      let errorMsg = `API Error: "${errorData?.error} - ${errorData?.error_description}"`

      if (errorData?.error_description == 'Refresh token revoked') {
        errorMsg +=
          '\n💡Tip: Generate a new refresh token with https://github.com/rocktimsaikia/spotify-rtoken-cli\n\n'
      }
      throw errorMsg
    }

    const responseData = (await response.json()) as AccessToken
    return responseData?.access_token
  }

  getCurrentTrack = async ({
    fallbackToLastPlayed = true
  }: CurrentlyPlayingOptions = {}): Promise<CurrentlyPlayingResponse | null> => {
    try {
      if (this.accessToken === null) {
        this.accessToken = await this._genAccesToken()
      }

      const headers = { Authorization: `Bearer ${this.accessToken}` }
      const response = await fetch(ENDPOINTS.currentlyPlaying, { headers })

      if (response.status === 401) {
        // This basically checks if the access token is expired and
        // if it is, it generates a new one and tries again
        this.accessToken = await this._genAccesToken()
        return this.getCurrentTrack({ fallbackToLastPlayed })
      }

      let isPlaying = true
      if (response.status === 204) {
        isPlaying = false
        return fallbackToLastPlayed
          ? { isPlaying, ...(await this.getRecentTracks())[0] }
          : null
      }
      const responseData = (await response.json()) as CurrentlyPlaying
      const currentTrack = filterTrack(responseData.item as Track)
      return { isPlaying, ...currentTrack }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  getRecentTracks = async (limit: number = 1): Promise<ResponseTrack[]> => {
    try {
      if (this.accessToken === null) this.accessToken = await this._genAccesToken()

      if (limit > 50 || limit < 1) throw new Error('Limit must be between 1 and 50')

      const headers = { Authorization: `Bearer ${this.accessToken}` }
      const response = await fetch(`${ENDPOINTS.lastPlayed}?limit=${limit}`, { headers })

      if (response.status === 401) {
        this.accessToken = await this._genAccesToken()
        return this.getRecentTracks(limit)
      }

      const responseData = (await response.json()) as RecentlyPlayed
      const lastPlayedTrack = responseData.items.map(({ track }) => filterTrack(track))
      return lastPlayedTrack
    } catch (error: any) {
      throw new Error(error)
    }
  }

  getTopTracks = async ({
    limit = 10,
    timeRange = 'short'
  }: TopItemsOptions = {}): Promise<ResponseTrack[]> => {
    try {
      if (this.accessToken === null) this.accessToken = await this._genAccesToken()

      if (limit > 50 || limit < 1) throw new Error('Limit must be between 1 and 50')

      const headers = { Authorization: `Bearer ${this.accessToken}` }
      const params = stringify({ time_range: `${timeRange}_term`, limit: limit })
      const response = await fetch(`${ENDPOINTS.topItems}/tracks/?${params}`, { headers })

      if (response.status === 401) {
        this.accessToken = await this._genAccesToken()
        return this.getTopTracks({ limit, timeRange })
      }

      const responseData = (await response.json()) as TopTracks
      const topTracks = responseData.items.map((item) => ({
        title: item.name,
        artist: item.artists[0].name,
        link: item.external_urls.spotify
      }))
      return topTracks
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
