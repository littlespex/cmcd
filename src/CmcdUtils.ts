import type { Cmcd } from './Cmcd';
import { CmcdShards } from './CmcdShards';

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export function uuid(): string {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

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

export function flatten(cmcd: DeepPartial<Cmcd>) {
  let payload = {};

  Object.values(CmcdShards).forEach(shard => {
    if (cmcd[shard]) {
      payload = { ...payload, ...cmcd[shard] };
    }
  });

  return payload;
}

export function toHeaders(cmcd: DeepPartial<Cmcd>) {
  const headers = {};

  Object.values(CmcdShards).forEach(shard => {
    if (cmcd[shard]) {
      headers[`cmcd-${shard}`] = serialize(cmcd[shard]);
    }
  });

  return headers;
}

export function toQuery(cmcd: DeepPartial<Cmcd>) {
  return `CMCD=${encodeURIComponent(serialize(flatten(cmcd)))}`;
}

export function toJson(cmcd: DeepPartial<Cmcd>) {
  return JSON.stringify(flatten(cmcd));
};
