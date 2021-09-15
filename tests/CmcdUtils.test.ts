import crypto from 'crypto';
import { Cmcd } from '../src/Cmcd';
import { serialize, toHeaders, toJson, toQuery, uuid } from '../src/CmcdUtils';

// @ts-ignore
global.crypto = crypto.webcrypto;

const data = new Cmcd();
data.sid = 'session-id';
data.cid = 'content-id';
data.su = false;
data.nor = '../testing/3.m4v';
data.nrr = '0-99';
data.d = 324.69;
data.mtp = 10049;
data.bs = true;
data.br = 200;
data.v = 1;
data.pr = 1;

// custom data
data['com.example-hello'] = 'world';
data['com.example-testing'] = 1234;
data['com.example-exists'] = true;
data['com.example-notExists'] = false;
data['com.example-token'] = Symbol('s');

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
  test('formatted, unsorted', () => {
    expect(toQuery(data)).toBe('CMCD=br%3D200%2Cd%3D325%2Cmtp%3D10000%2Cnor%3D%22..%252Ftesting%252F3.m4v%22%2Cnrr%3D%220-99%22%2Ccid%3D%22content-id%22%2Csid%3D%22session-id%22%2Cbs%2Ccom.example-hello%3D%22world%22%2Ccom.example-testing%3D1234%2Ccom.example-exists%2Ccom.example-token%3Ds');
  });

  test('sorted', () => {
    expect(toQuery(data, { sort: true })).toBe('CMCD=br%3D200%2Cbs%2Ccid%3D%22content-id%22%2Ccom.example-exists%2Ccom.example-hello%3D%22world%22%2Ccom.example-testing%3D1234%2Ccom.example-token%3Ds%2Cd%3D325%2Cmtp%3D10000%2Cnor%3D%22..%252Ftesting%252F3.m4v%22%2Cnrr%3D%220-99%22%2Csid%3D%22session-id%22');
  });

  test('unformatted', () => {
    expect(toQuery(data, { format: false })).toBe('CMCD=br%3D200%2Cd%3D324.69%2Cmtp%3D10049%2Cnor%3D%22..%2Ftesting%2F3.m4v%22%2Cnrr%3D%220-99%22%2Ccid%3D%22content-id%22%2Csid%3D%22session-id%22%2Cbs%2Ccom.example-hello%3D%22world%22%2Ccom.example-testing%3D1234%2Ccom.example-exists%2Ccom.example-token%3Ds');
  });
});

describe('Header serialization', () => {
  test('all shards', () => {
    expect(toHeaders(data)).toEqual({
      'cmcd-object': 'br=200,d=325',
      'cmcd-request': 'mtp=10000,nor="..%2Ftesting%2F3.m4v",nrr="0-99"',
      'cmcd-session': 'cid="content-id",sid="session-id"',
      'cmcd-status': 'bs',
    });
  });

  test('ignore empty shards', () => {
    expect(toHeaders({ br: 200 })).toEqual({
      'cmcd-object': 'br=200',
    });
  });
});

describe('JSON serialization', () => {

  test('json', () => {
    expect(toJson(data)).toEqual('{"br":200,"bs":true,"cid":"content-id","com.example-exists":true,"com.example-hello":"world","com.example-testing":1234,"com.example-token":"s","d":325,"mtp":10000,"nor":"..%2Ftesting%2F3.m4v","nrr":"0-99","sid":"session-id"}');
  });

  test('empty', () => {
    expect(toJson(null)).toEqual('{}');
  });
});
