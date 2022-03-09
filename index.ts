import fetch from 'node-fetch';
import { stringify } from 'node:querystring';
import type { AccessToken, CurrentlyPlaying, Track } from 'spotify-types';

const ACCESS_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL = `https://api.spotify.com/v1/me/player/currently-playing`;
const LAST_PLAYED_URL = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

type ResponseTrack = {
  title: string;
  artist: string;
  link: string;
};

type SpotifyClientOptions = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type CurrentlyPlayingOptions = {
  fallbackToLastPlayed?: boolean;
};

const filterResponse = (track: Track): ResponseTrack => ({
  title: track?.name,
  artist: track?.artists?.map((artist) => artist?.name).join(', '),
  link: track?.external_urls.spotify
});

const encodeToBase64 = (str: string): string => Buffer.from(str).toString('base64');
export class SpotifyClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;

  constructor({ clientId, clientSecret, refreshToken }: SpotifyClientOptions) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
  }

  private _genAccesToken = async () => {
    const basicToken = encodeToBase64(`${this.clientId}:${this.clientSecret}`);

    const response = await fetch(ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });
    const responseData = (await response.json()) as AccessToken;
    return responseData?.access_token;
  };

  getCurrentlyPlaying = async ({
    fallbackToLastPlayed = false
  }: CurrentlyPlayingOptions = {}) => {
    try {
      const accessToken = await this._genAccesToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await fetch(CURRENTLY_PLAYING_URL, { headers });
      let isPlaying = true;
      if (response.status === 204) {
        isPlaying = false;
        return fallbackToLastPlayed
          ? { isPlaying, ...(await this.getLastPlayed()) }
          : null;
      }
      const responseData = (await response.json()) as CurrentlyPlaying;
      const currentTrack = filterResponse(responseData?.item as Track);
      return { isPlaying, ...currentTrack };
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getLastPlayed = async () => {
    try {
      const accessToken = await this._genAccesToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await fetch(LAST_PLAYED_URL, { headers });
      // TODO: add types once spotify-types is updated
      const responseData = (await response.json()) as any;
      const lastPlayedTrack = filterResponse(responseData?.items[0]?.track);
      return lastPlayedTrack;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}
