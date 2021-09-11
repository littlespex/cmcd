import { Cmcd } from './Cmcd';
import { toHeaders, toJson, toQuery } from './CmcdUtils';

const data = new Cmcd();
data.session.sid = 'session-id';
data.session.cid = 'content-id';
data.request.su = false;
data.request.nrr = '0-99';
data.request.mtp = 10000;
data.status.bs = true;
data.object.br = 200;

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
