/**
 * Encode options
 */
export interface CmcdEncodeOptions {
  /**
   * When `true` the encoder will automatically format values to adhere to
   * the `SHOULD` and `RECOMMENDED` directive from the [CMCD spec](https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf).
   * 
   * For example, it will round `mtp` to the nearest 100 kbps.
   * 
   * @default true
   */
  format: boolean;

  /**
   * When `true` the encoder will sort the key values during the serialization process.
   * 
   * @default false
   */
  sort: boolean;
}
