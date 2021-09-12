import { Cmcd } from './Cmcd.js';

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
 * Flatten a CMCD object into a single tier data object
 */
export function flatten(cmcd: DeepPartial<Cmcd>) {
  let payload = {};

  Object.values(Cmcd.SHARDS).forEach(props => {
    props.forEach(prop => {
      if (cmcd[prop] != null) {
        payload[prop] = cmcd[prop];
      }
    });
  });

  return payload;
}

/**
 * Convert a CMCD data object to request headers
 */
export function toHeaders(cmcd: DeepPartial<Cmcd>) {
  const headers = {};

  Object.entries(Cmcd.SHARDS).forEach(([shard, props]) => {
    props.forEach(prop => {
      if (cmcd[prop] != null) {
        headers[`cmcd-${shard}`] = serialize(cmcd[prop]);
      }
    });
  });

  return headers;
}

/**
 * Convert a CMCD data object to query args
 */
export function toQuery(cmcd: DeepPartial<Cmcd>) {
  return `CMCD=${encodeURIComponent(serialize(flatten(cmcd)))}`;
}

/**
 * Convert a CMCD data object to JSON
 */
export function toJson(cmcd: DeepPartial<Cmcd>) {
  return JSON.stringify(flatten(cmcd));
};
