import { CmcdObject } from './CmcdObject';
import { CmcdRequest } from './CmcdRequest';
import { CmcdSession } from './CmcdSession';
import { CmcdStatus } from './CmcdStatus';

/**
 * CMCD
 */
export class Cmcd {
  request: CmcdRequest = new CmcdRequest();
  session: CmcdSession = new CmcdSession();
  object: CmcdObject = new CmcdObject();
  status: CmcdStatus = new CmcdStatus();
}
