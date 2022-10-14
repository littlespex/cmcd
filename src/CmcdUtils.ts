import { Cmcd } from './Cmcd';
import { CmcdCustomKey } from './CmcdCustomKey';
import { CmcdHeader } from './CmcdHeader';
import { CmcdKey } from './CmcdKey';
import { CmcdValue } from './CmcdValue';

const isTokenField = (key: string) => key === 'ot' || key === 'sf' || key === 'st';
const toHeaderCase = (value: string) => `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`;
const isValid = (value: CmcdValue) => value != null && value !== '' && value !== false;
const toHundred = (value: number) => Math.round(value / 100) * 100;
const toRounded = (value: number) => Math.round(value);
const toUrlSafe = (value: string) => encodeURIComponent(value);
const formatters: Record<string, (value: CmcdValue) => number | string> = {
	br: toHundred,
	d: toRounded,
	bl: toHundred,
	dl: toHundred,
	mtp: toHundred,
	nor: toUrlSafe,
	rtp: toHundred,
};
const headerMap: Record<CmcdKey, CmcdHeader> = {
	br: 0, d: 0, ot: 0, tb: 0,
	bl: 1, dl: 1, mtp: 1, nor: 1, nrr: 1, su: 1,
	cid: 2, pr: 2, sf: 2, sid: 2, st: 2, v: 2,
	bs: 3, rtp: 3,
};

/**
 * Generate a random v4 UUID
 */
export function uuid(): string {
	let dt = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

type Mapper<T> = (value: CmcdValue, key?: string, obj?: Cmcd) => T;

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

		const formatter = formatters[key];
		if (formatter) {
			value = formatter(value);
		}

		const result = map(value, key, obj);
		results.push(result);
	});

	return results;
}

/**
 * Encode a CMCD object to a string.
 */
export function encode(obj: Cmcd) {
	return processData<string>(obj, (value, key) => {
		switch (typeof value) {
			case 'boolean':
				return key;

			case 'number':
				return `${key}=${value}`;

			case 'symbol':
				return `${key}=${value.description}`;

			case 'string':
				if (isTokenField(key)) {
					return `${key}=${value}`;
				}

				return `${key}=${JSON.stringify(value)}`;
		}
	}).join(',');
}

/**
 * Decode a CMCD string to an object.
 */
export function decode(cmcd: string): Cmcd {
	return decodeURIComponent(cmcd.replace(/^CMCD=/, ''))
		.split(',')
		.reduce((acc: Record<string, boolean | number | string>, part) => {
			const [key, value] = part.split('=');

			if (!value) {
				acc[key] = true;
			}
			else if (isTokenField(key)) {
				acc[key] = value;
			}
			else {
				acc[key] = JSON.parse(value);
			}

			return acc;
		}, {}) as Cmcd;
}

/**
	 * Convert a CMCD data object to request headers
	 */
export function toHeaders(cmcd: Cmcd, customHeaderMap: Record<CmcdCustomKey, CmcdHeader> = {}) {
	const headers: Record<string, string> = {};

	if (!cmcd) {
		return headers;
	}

	const entries = Object.entries(cmcd) as [CmcdKey | CmcdCustomKey, CmcdValue][];
	const headerGroups: Record<string, CmcdValue>[] = [{}, {}, {}, {}];

	entries.forEach(([key, value]) => {
		let index = headerMap[key];
		if (index == null) {
			const custom = key as CmcdCustomKey;
			index = customHeaderMap[custom] != null ? customHeaderMap[custom] : 1;
		}
		headerGroups[index][key] = value;
	});

	headerGroups.forEach((group, index) => {
		const value = encode(group);
		if (value) {
			headers[`CMCD-${toHeaderCase(CmcdHeader[index])}`] = value;
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
	return `CMCD=${encodeURIComponent(encode(cmcd))}`;
}

/**
	 * Convert a CMCD data object to JSON
	 */
export function toJson(cmcd: Partial<Cmcd>) {
	const toValue = (value: CmcdValue) => typeof value == 'symbol' ? value.description : value;
	const data = processData(cmcd, (value, key) => [key, toValue(value)]);
	return JSON.stringify(Object.fromEntries(data));
}

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
