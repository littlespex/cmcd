/**
 * CMCD Status
 */
export class CmcdStatus {
  /**
   * Buffer starvation
   * 
   * Key is included without a value if the buffer was starved at some point between the prior request and this object request, 
   * resulting in the player being in a rebuffering state and the video or audio playback being stalled. This key MUST NOT be 
   * sent if the buffer was not starved since the prior request.
   * 
   * If the object type ‘ot’ key is sent along with this key, then the ‘bs’ key refers to the buffer associated with the particular 
   * object type. If no object type is communicated, then the buffer state applies to the current session.
   * 
   * Boolean
   */
  bs: boolean;

  /**
   * Requested maximum throughput
   * 
   * The requested maximum throughput that the client considers sufficient for delivery of the asset. Values MUST be rounded to the 
   * nearest 100kbps. For example, a client would indicate that the current segment, encoded at 2Mbps, is to be delivered at no more 
   * than 10Mbps, by using rtp=10000.
   * 
   * Note: This can benefit clients by preventing buffer saturation through over-delivery and can also deliver a community benefit 
   * through fair-share delivery. The concept is that each client receives the throughput necessary for great performance, but no more. 
   * The CDN may not support the rtp feature.
   * 
   * Integer kbps
   */
  rtp: number;
}
