import { Cmcd } from './Cmcd.js';
import { toHeaders, toJson, toQuery } from './CmcdUtils.js';

const data = new Cmcd();
data.sid = 'session-id';
data.cid = 'content-id';
data.su = false;
data.nrr = '0-99';
data.mtp = 10000;
data.bs = true;
data.br = 200;

test('Query serialization', () => {
  expect(toQuery(data)).toBe('CMCD=br%3D200%2Cbs%2Ccid%3D%22content-id%22%2Cmtp%3D10000%2Cnrr%3D%220-99%22%2Csid%3D%22session-id%22');
});

test('Header serialization', () => {
  expect(toHeaders(data)).toEqual({
    'cmcd-object': 'br=200',
    'cmcd-request': 'mtp=10000,nrr="0-99"',
    'cmcd-session': 'cid="content-id",sid="session-id"',
    'cmcd-status': 'bs',
  });
});

test('JSON serialization', () => {
  expect(toJson(data)).toEqual('{"mtp":10000,"nrr":"0-99","su":false,"br":200,"cid":"content-id","sid":"session-id","bs":true}');
});
