import { Cmcd } from '../src/Cmcd';
import { toHeaders, toJson, toQuery } from '../src/CmcdUtils';

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

test('Query serialization', () => {
  expect(toQuery(data)).toBe('CMCD=br%3D200%2Cd%3D325%2Cmtp%3D10000%2Cnor%3D%22..%252Ftesting%252F3.m4v%22%2Cnrr%3D%220-99%22%2Ccid%3D%22content-id%22%2Csid%3D%22session-id%22%2Cbs');
});

test('Header serialization', () => {
  expect(toHeaders(data)).toEqual({
    'cmcd-object': 'br=200,d=325',
    'cmcd-request': 'mtp=10000,nor="..%2Ftesting%2F3.m4v",nrr="0-99"',
    'cmcd-session': 'cid="content-id",sid="session-id"',
    'cmcd-status': 'bs',
  });
});

test('JSON serialization', () => {
  expect(toJson(data)).toEqual('{"br":200,"bs":true,"cid":"content-id","d":325,"mtp":10000,"nor":"..%2Ftesting%2F3.m4v","nrr":"0-99","sid":"session-id"}');
});
