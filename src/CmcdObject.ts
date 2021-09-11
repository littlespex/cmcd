import { CmcdObjectType } from './CmcdObjectType';

/**
 * CMCD Object
 */
export class CmcdObject {
  /**
   * Encoded bitrate
   * 
   * The encoded bitrate of the audio or video object being requested. This may not be known precisely by the player; however,
   * it MAY be estimated based upon playlist/manifest declarations. If the playlist declares both peak and average bitrate values, 
   * the peak value should be transmitted.
   *
   * Integer kbps
   */
  br: number;

  /**
   * Object duration
   * 
   * The playback duration in milliseconds of the object being requested. If a partial segment is being requested, then this value
   * MUST indicate the playback duration of that part and not that of its parent segment. This value can be an approximation of the 
   * estimated duration if the explicit value is not known.
   * 
   * Integer milliseconds
   */
  d: number;

  /**
   * Object type
   * 
   * The media type of the current object being requested:
   *   m = text file, such as a manifest or playlist
   *   a = audio only
   *   v = video only
   *   av = muxed audio and video
   *   i = init segment
   *   c = caption or subtitle
   *   tt = ISOBMFF timed text track
   *   k = cryptographic key, license or certificate.
   *   o = other
   * If the object type being requested is unknown, then this key MUST NOT be used.
   * 
   * 
   */
  ot: CmcdObjectType;

  /**
   * Top bitrate
   * 
   * The highest bitrate rendition in the manifest or playlist that the client is allowed to play, given current codec, licensing and 
   * sizing constraints.
   * 
   * Integer Kbps
   */
  tb: number;
}
