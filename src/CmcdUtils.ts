import { Cmcd } from './Cmcd';
import { CmcdShards } from './CmcdShards';

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/**
 * Generate a random v4 UUID
 */
export function uuid(): string {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

/**
 * Convert the CMCD data objects to string
 */
export function serialize(obj: any) {
  try {
    if (!obj) {
      return '';
    }

    const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    const params = keys.reduce((acc, key) => {
      const value = obj[key];
      if (value === null || value === undefined) {
        return acc;
      }

      // Version should only be reported if not equal to 1.
      if (key === 'v' && value === 1) {
        return acc;
      }

      // Playback rate should only be sent if not equal to 1.
      if (key == 'pr' && value === 1) {
        return acc;
      }

      const type = typeof value;

      if (type === 'string' && key !== 'ot' && key !== 'sf' && key !== 'st') {
        acc.push(`${key}="${value.replace(/"/g, '\"')}"`);
      }
      else if (type === 'boolean') {
        if (value === true) {
          acc.push(key);
        }
      }
      else {
        acc.push(`${key}=${value}`);
      }

      return acc;
    }, []);

    return params.join(',');
  }
  catch (e) {
    return '';
  }
}

/**
 * Convert a CMCD data object to request headers
 */
export function toHeaders(cmcd: DeepPartial<Cmcd>) {
  const headers = {};

  const entries = Object.entries(cmcd);
  Object.entries(CmcdShards).forEach(([shard, props]) => {
    const shards = entries.filter(entry => props.includes(entry[0]));
    headers[`cmcd-${shard}`] = serialize(Object.fromEntries(shards));
  });

  return headers;
}

/**
 * Convert a CMCD data object to query args
 */
export function toQuery(cmcd: DeepPartial<Cmcd>) {
  return `CMCD=${encodeURIComponent(serialize(cmcd))}`;
}

/**
 * Convert a CMCD data object to JSON
 */
export function toJson(cmcd: DeepPartial<Cmcd>) {
  return JSON.stringify(cmcd);
};
