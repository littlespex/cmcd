import { Cmcd } from './Cmcd';
import { CmcdEncodeOptions } from './CmcdEncodeOptions';

const isValid = (value: any) => value != null && value !== '' && value !== false;
const toHundred = (value: number) => Math.round(value / 100) * 100;
const toRounded = (value: number) => Math.round(value);
const toUrlSafe = (value: string) => encodeURIComponent(value);
const formatters = {
  br: toHundred,
  d: toRounded,
  bl: toHundred,
  dl: toHundred,
  mtp: toHundred,
  nor: toUrlSafe,
  rtp: toHundred,
};

/**
 * Generate a random v4 UUID
 */
export function uuid(): string {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

export function serialize(obj: any, { format = true, sort = false }: Partial<CmcdEncodeOptions> = {}) {
  try {
    return processData(obj, {
      format,
      sort,
      map: (value, key) => {
        const type = typeof value;

        if (type === 'string' && key !== 'ot' && key !== 'sf' && key !== 'st') {
          return `${key}="${value.replace(/"/g, '\"')}"`;
        }
        else if (type === 'boolean') {
          return key;
        }
        else if (type === 'symbol') {
          return `${key}=${value.description}`;
        }
        else {
          return `${key}=${value}`;
        }
      }
    }).join(',');
  }
  catch (error) {

  }
}

type ProcessOptions = CmcdEncodeOptions & { map: (value: any, key?: string, obj?: any) => any; };

function processData(obj: any, { format = true, sort = true, map }: Partial<ProcessOptions>): any {
  const results = [];

  Object
    .keys(obj || {})
    .forEach(key => {
      let value = obj[key];

      // ignore invalid values
      if (!isValid(value)) {
        return;
      }

      // Version should only be reported if not equal to 1.
      if (key === 'v' && value === 1) {
        return;
      }

      // Playback rate should only be sent if not equal to 1.
      if (key == 'pr' && value === 1) {
        return;
      }

      if (format) {
        const formatter = formatters[key];
        if (formatter) {
          value = formatter(value);
        }
      }

      const result = map(value, key, obj);

      // sort inline
      if (sort) {
        const nextIndex = results.findIndex(i => result < i);
        const index = nextIndex > -1 ? nextIndex : results.length;
        results.splice(index, 0, result);
      }
      else {
        results.push(result);
      }
    });

  return results;
}

/**
 * Convert a CMCD data object to request headers
 */
export function toHeaders(cmcd: Partial<Cmcd>, options?: Partial<CmcdEncodeOptions>) {
  const entries = Object.entries(cmcd);
  const headers = {};
  const headerNames = ['Object', 'Request', 'Session', 'Status'];
  const headerGroups = [{}, {}, {}, {}];
  const headerMap = {
    br: 0, d: 0, ot: 0, tb: 0,
    bl: 1, dl: 1, mtp: 1, nor: 1, nrr: 1, su: 1,
    cid: 2, pr: 2, sf: 2, sid: 2, st: 2, v: 2,
    bs: 3, rtp: 3,
  };

  entries.forEach(([key, value]) => {
    const index = (headerMap[key] != null) ? headerMap[key] : 1;
    headerGroups[index][key] = value;
  });

  headerGroups.forEach((group, index) => {
    const value = serialize(headerGroups[index]);
    if (value) {
      headers[`CMCD-${headerNames[index]}`] = value;
    }
  });

  return headers;
}

/**
 * Convert a CMCD data object to query args
 */
export function toQuery(cmcd: Partial<Cmcd>, options?: Partial<CmcdEncodeOptions>) {
  return `CMCD=${encodeURIComponent(serialize(cmcd, options))}`;
}

/**
 * Convert a CMCD data object to JSON
 */
export function toJson(cmcd: Partial<Cmcd>, options?: Partial<CmcdEncodeOptions>) {
  const data = processData(cmcd, {
    ...options,
    map: (value, key) => [key, typeof value == 'symbol' ? value.description : value],
  });
  return JSON.stringify(Object.fromEntries(data));
};
