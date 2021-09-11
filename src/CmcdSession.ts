import { CmcdStreamingFormat } from './CmcdStreamingFormat';
import { CmcdStreamType } from './CmcdStreamType';

/**
 * CMCD Session
 */
export class CmcdSession {
  /**
   * Content ID
   * 
   * A unique string identifying the current content. Maximum length is 64 characters. This value is consistent across multiple different 
   * sessions and devices and is defined and updated at the discretion of the service provider.
   * 
   * String
   */
  cid: string;

  /**
   * Playback rate
   * 
   * 1 if real-time, 2 if double speed, 0 if not playing. SHOULD only be sent if not equal to 1.
   * 
   * Decimal
   */
  pr: number;

  /**
   * Streaming format
   * 
   * The streaming format that defines the current request.
   * 
   *   d = MPEG DASH
   *   h = HTTP Live Streaming (HLS)
   *   s = Smooth Streaming
   *   o = other
   * 
   * If the streaming format being requested is unknown, then this key MUST NOT be used.
   */
  sf: CmcdStreamingFormat;

  /**
   * Session ID
   * 
   * A GUID identifying the current playback session. A playback session typically ties together segments belonging to a single media asset.
   * Maximum length is 64 characters. It is RECOMMENDED to conform to the UUID specification [7].
   * 
   * String
   */
  sid: string;

  /**
   * Stream type
   *   v = all segments are available – e.g., VOD
   *   l = segments become available over time – e.g., LIVE
   */
  st: CmcdStreamType;

  /**
   * CMCD version
   * 
   * The version of this specification used for interpreting the defined key names and values. If this key is omitted, the client and server MUST 
   * interpret the values as being defined by version 1. Client SHOULD omit this field if the version is 1.
   * 
   * Integer
   */
  v: number;
}
