import { CmcdHeader } from './CmcdHeader';

export const CmcdHeaderMap = {
  br: CmcdHeader.OBJECT,
  d: CmcdHeader.OBJECT,
  ot: CmcdHeader.OBJECT,
  tb: CmcdHeader.OBJECT,
  bl: CmcdHeader.REQUEST,
  dl: CmcdHeader.REQUEST,
  mtp: CmcdHeader.REQUEST,
  nor: CmcdHeader.REQUEST,
  nrr: CmcdHeader.REQUEST,
  su: CmcdHeader.REQUEST,
  cid: CmcdHeader.SESSION,
  pr: CmcdHeader.SESSION,
  sf: CmcdHeader.SESSION,
  sid: CmcdHeader.SESSION,
  st: CmcdHeader.SESSION,
  v: CmcdHeader.SESSION,
  bs: CmcdHeader.STATUS,
  rtp: CmcdHeader.STATUS,
};
