
/**
 * CMCD Request
 */
export class CmcdRequest {
  /**
   * Deadline
   * 
   * Deadline from the request time until the first sample of this Segment/Object needs to be available in order to not create a buffer underrun or 
   * any other playback problems. This value MUST be rounded to the nearest 100ms. For a playback rate of 1, this may be equivalent to the player’s 
   * remaining buffer length.
   * 
   * Integer milliseconds
   */
  dl: number;

  /**
   * Measured mtp CMCD- throughput
   * 
   * The throughput between client and server, as measured by the client and MUST be rounded to the nearest 100 kbps. This value, however derived, 
   * SHOULD be the value that the client is using to make its next Adaptive Bitrate switching decision. If the client is connected to multiple 
   * servers concurrently, it must take care to report only the throughput measured against the receiving server. If the client has multiple concurrent 
   * connections to the server, then the intent is that this value communicates the aggregate throughput the client sees across all those connections.
   * 
   * Integer kbps
   */
  mtp: number;

  /**
   * Next object request
   * 
   * Relative path of the next object to be requested. This can be used to trigger pre-fetching by the CDN. This MUST be a path relative to the current 
   * request. This string MUST be URLEncoded [5]. The client SHOULD NOT depend upon any pre-fetch action being taken - it is merely a request for such a 
   * pre-fetch to take place.
   * 
   * String
   */
  nor: string;

  /**
   * Next range request
   * 
   * If the next request will be a partial object request, then this string denotes the byte range to be requested. If the ‘nor’ field is not set, then the 
   * object is assumed to match the object currently being requested. The client SHOULD NOT depend upon any pre-fetch action being taken – it is merely a 
   * request for such a pre-fetch to take place. Formatting is similar to the HTTP Range header, except that the unit MUST be ‘byte’, the ‘Range:’ prefix is 
   * NOT required and specifying multiple ranges is NOT allowed. Valid combinations are:
   * 
   * "<range-start>-"
   * "<range-start>-<range-end>"
   * "-<suffix-length>"
   * 
   * String
   */
  nrr: string;

  /**
   * Startup
   * 
   * Key is included without a value if the object is needed urgently due to startup, seeking or recovery after a buffer-empty event. The media SHOULD not be 
   * rendering when this request is made. This key MUST not be sent if it is FALSE.
   * 
   * Boolean
   */
  su: boolean;
}
