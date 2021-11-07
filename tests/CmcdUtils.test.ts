import crypto from 'crypto';
import { Cmcd } from '../src/Cmcd';
import { appendToHeaders, appendToUrl, serialize, toHeaders, toJson, toQuery, uuid } from '../src/CmcdUtils';

// @ts-ignore
global.crypto = crypto.webcrypto;

const data: Cmcd = {
  sid: 'session-id',
  cid: 'content-id',
  su: false,
  nor: '../testing/3.m4v',
  nrr: '0-99',
  d: 324.69,
  mtp: 10049,
  bs: true,
  br: 200,
  v: 1,
  pr: 1,
  // custom data
  ['com.example-hello']: 'world',
  ['com.example-testing']: 1234,
  ['com.example-exists']: true,
  ['com.example-notExists']: false,
  ['com.example-token']: Symbol('s'),
  ['com.example-quote']: '"Quote"',
};

describe('UUID generation', () => {
  const regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
  const id = uuid();

  test('format', () => {
    expect(regex.test(id)).toBe(true);
  });

  test('unique', () => {
    expect(uuid() == id).toBe(false);
  });
});

describe('serialize', () => {
  test('empty', () => {
    expect(serialize({})).toEqual('');
  });
});

describe('Query serialization', () => {
  test('handles null data object', () => {
    expect(toQuery(null)).toEqual('');
  });

  test('returns encoded query string', () => {
    expect(toQuery(data,)).toBe('CMCD=br%3D200%2Cbs%2Ccid%3D%22content-id%22%2Ccom.example-exists%2Ccom.example-hello%3D%22world%22%2Ccom.example-quote%3D%22%5C%22Quote%5C%22%22%2Ccom.example-testing%3D1234%2Ccom.example-token%3Ds%2Cd%3D325%2Cmtp%3D10000%2Cnor%3D%22..%252Ftesting%252F3.m4v%22%2Cnrr%3D%220-99%22%2Csid%3D%22session-id%22');
  });
});

describe('Header serialization', () => {
  test('all shards', () => {
    expect(toHeaders(data)).toEqual({
      'CMCD-Object': 'br=200,d=325',
      'CMCD-Request': 'com.example-exists,com.example-hello="world",com.example-quote="\\"Quote\\"",com.example-testing=1234,com.example-token=s,mtp=10000,nor="..%2Ftesting%2F3.m4v",nrr="0-99"',
      'CMCD-Session': 'cid="content-id",sid="session-id"',
      'CMCD-Status': 'bs',
    });
  });

  test('ignore empty shards', () => {
    expect(toHeaders({ br: 200 })).toEqual({
      'CMCD-Object': 'br=200',
    });
  });

  test('handles null data object', () => {
    expect(toHeaders(null)).toEqual({});
  });
});

describe('JSON serialization', () => {
  test('json', () => {
    expect(toJson(data)).toEqual('{"br":200,"bs":true,"cid":"content-id","com.example-exists":true,"com.example-hello":"world","com.example-quote":"\\"Quote\\"","com.example-testing":1234,"com.example-token":"s","d":325,"mtp":10000,"nor":"..%2Ftesting%2F3.m4v","nrr":"0-99","sid":"session-id"}');
  });

  test('empty', () => {
    expect(toJson(null)).toEqual('{}');
  });
});

describe('appendToUrl', () => {
  const url = 'https://test.com';
  const data = {
    br: 1000,
  };

  test('handles null data object', () => {
    expect(appendToUrl(url, null)).toEqual(url);
  });

  test('add ? when query does not exist', () => {
    expect(appendToUrl(url, data)).toEqual(`${url}?CMCD=br%3D1000`);
  });

  test('add & when query does exist', () => {
    expect(appendToUrl(`${url}?hello=world`, data)).toEqual(`${url}?hello=world&CMCD=br%3D1000`);
  });
});

describe('appendToHeader', () => {
  const headers = {
    hello: 'world',
  };

  const data = {
    br: 1000,
  };

  test('handles null data object', () => {
    expect(appendToHeaders(headers, null)).toEqual(headers);
  });

  test('appends headers', () => {
    expect(appendToHeaders(headers, data)).toEqual({
      ...headers,
      ['CMCD-Object']: 'br=1000',
    });
  });
});
