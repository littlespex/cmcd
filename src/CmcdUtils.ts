import { Cmcd } from './Cmcd';
import { CmcdCustomKey } from './CmcdCustomKey';
import { CmcdHeader } from './CmcdHeader';
import { CmcdKey } from './CmcdKey';
import { CmcdValue } from './CmcdValue';

const isValid = (value: any) => value != null && value !== '' && value !== false;
const toHundred = (value: number) => Math.round(value / 100) * 100;
const toRounded = (value: number) => Math.round(value);
const toUrlSafe = (value: string) => encodeURIComponent(value);
const formatters: Record<string, (value: any) => any> = {
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

/**
 * Serialize a CMCD object.
 */
export function serialize(obj: Cmcd) {
  return processData<string>(obj, (value, key) => {
    const type = typeof value;

    if (key === 'ot' || key === 'sf' || key === 'st') {
      return `${key}=${value}`;
    }
    if (type === 'string') {
      return `${key}=${JSON.stringify(value)}`;
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
  }).join(',');
}

type Mapper<T> = (value: any, key?: string, obj?: any) => T;

function processData<T>(obj: Cmcd, map: Mapper<T>): T[] {
  const results: T[] = [];

  if (!obj) {
    return results;
  }

  const keys = Object.keys(obj).sort() as CmcdKey[];
  keys.forEach(key => {
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

    const formatter: any = formatters[key];
    if (formatter) {
      value = formatter(value);
    }

    const result = map(value, key, obj);
    results.push(result);
  });

  return results;
}

/**
 * Convert a CMCD data object to request headers
 */
export function toHeaders(cmcd: Cmcd, customHeaderMap: Record<CmcdCustomKey, CmcdHeader> = {}) {
  const headers: Record<string, string> = {};

  if (!cmcd) {
    return headers;
  }

  const entries = Object.entries(cmcd) as [CmcdKey, CmcdValue][];
  const headerGroups: Record<string, any>[] = [{}, {}, {}, {}];
  const headerMap: Record<CmcdKey, CmcdHeader> = {
    br: 0, d: 0, ot: 0, tb: 0,
    bl: 1, dl: 1, mtp: 1, nor: 1, nrr: 1, su: 1,
    cid: 2, pr: 2, sf: 2, sid: 2, st: 2, v: 2,
    bs: 3, rtp: 3,
  };

  entries.forEach(([key, value]) => {
    let index = headerMap[key];
    if (index == null) {
      // @ts-ignore
      index = customHeaderMap[key] != null ? customHeaderMap[key] : 1;
    }
    headerGroups[index][key] = value;
  });

  headerGroups.forEach((group, index) => {
    const value = serialize(group);
    if (value) {
      headers[`CMCD-${CmcdHeader[index]}`] = value;
    }
  });

  return headers;
}

/**
 * Convert a CMCD data object to query args
 */
export function toQuery(cmcd: Cmcd) {
  if (!cmcd) {
    return '';
  }
  return `CMCD=${encodeURIComponent(serialize(cmcd))}`;
}

/**
 * Convert a CMCD data object to JSON
 */
export function toJson(cmcd: Partial<Cmcd>) {
  const toValue = (value: CmcdValue) => typeof value == 'symbol' ? value.description : value;
  const data = processData(cmcd, (value, key) => [key, toValue(value)]);
  return JSON.stringify(Object.fromEntries(data));
};

/**
 * Append CMCD query args to a URL.
 */
export function appendToUrl(url: string, cmcd: Cmcd) {
  const query = toQuery(cmcd);
  if (!query) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${query}`;
}

/**
 * Append CMCD query args to a header object.
 */
export function appendToHeaders(headers: Record<string, string>, cmcd: Cmcd, customHeaderMap?: Record<CmcdCustomKey, CmcdHeader>) {
  return Object.assign(headers, toHeaders(cmcd, customHeaderMap));
}
