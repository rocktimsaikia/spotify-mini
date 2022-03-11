import fetch from 'node-fetch';
import { stringify } from 'node:querystring';
import type { AccessToken, CurrentlyPlaying, Track } from 'spotify-types';

const ACCESS_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL = `https://api.spotify.com/v1/me/player/currently-playing`;
const LAST_PLAYED_URL = `https://api.spotify.com/v1/me/player/recently-played`;

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

type CurrentlyPlayingResponse = ResponseTrack & {
  isPlaying: boolean;
}

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
  private accessToken: string | null = null;

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
  }: CurrentlyPlayingOptions = {}): Promise<CurrentlyPlayingResponse | null> => {
    try {
      if(this.accessToken === null) 
        this.accessToken = await this._genAccesToken();

      const headers = { Authorization: `Bearer ${this.accessToken}` };
      const response = await fetch(CURRENTLY_PLAYING_URL, { headers });

      if(response.status === 401) {
        this.accessToken = await this._genAccesToken();
        return this.getCurrentlyPlaying({ fallbackToLastPlayed });
      }

      let isPlaying = true;
      if (response.status === 204) {
        isPlaying = false;
        return fallbackToLastPlayed
          ? { isPlaying, ...(await this.getLastPlayed())[0]}
          : null;
      }
      const responseData = (await response.json()) as CurrentlyPlaying;
      const currentTrack = filterResponse(responseData?.item as Track);
      return { isPlaying, ...currentTrack };
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getLastPlayed = async (limit: number = 1): Promise<ResponseTrack[]> => {
    try {
      
      if(this.accessToken === null) 
        this.accessToken = await this._genAccesToken();
      
      if(limit > 50 || limit < 1)
        throw new Error('Limit must be between 1 and 50');
      
      const headers = { Authorization: `Bearer ${this.accessToken}` };
      const response = await fetch(`${LAST_PLAYED_URL}?limit=${limit}`, { headers });

      if (response.status === 401) {
        this.accessToken = await this._genAccesToken();
        return this.getLastPlayed(limit);
      }

      // TODO: add types once spotify-types is updated
      const responseData = (await response.json()) as any;
      const lastPlayedTrack = responseData.items.map((item: { track: Track; }) => {
        return filterResponse(item.track);
      })

      return lastPlayedTrack;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}
