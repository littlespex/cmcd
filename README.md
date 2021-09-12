# cmcd-ts
CMCD (Common Media Client Data) Typescript definitions.

## Install
```shell
npm i cmcd-ts
```

## Usage
```typescript
import { Cmcd, toHeaders, toJson, toQuery } from 'cmcd-ts';

const data = new Cmcd();
data.session.sid = '9f7f349b-baba-43d7-bbe7-b0dc8a65af0d';
data.session.cid = '3b943dc3-167b-47d6-adf7-3c06daa96d0b';
data.request.su = false;
data.request.nrr = '0-99';
data.request.mtp = 10000;
data.status.bs = true;
data.object.br = 200;

const query = toQuery(data));
/* 
'CMCD=br%3D200%2Cbs%2Ccid%3D%223b943dc3-167b-47d6-adf7-3c06daa96d0b%22%2Cmtp%3D10000%2Cnrr%3D%220-99%22%2Csid%3D%229f7f349b-baba-43d7-bbe7-b0dc8a65af0d%22'
*/

const headers = toHeaders(data));
/*
{
  'cmcd-object': 'br=200',
  'cmcd-request': 'mtp=10000,nrr="0-99"',
  'cmcd-session': 'cid="3b943dc3-167b-47d6-adf7-3c06daa96d0b",sid="9f7f349b-baba-43d7-bbe7-b0dc8a65af0d"',
  'cmcd-status': 'bs',
}
*/

const json = toJson(data));
/*
'{"mtp":10000,"nrr":"0-99","su":false,"br":200,"cid":"3b943dc3-167b-47d6-adf7-3c06daa96d0b","sid":"9f7f349b-baba-43d7-bbe7-b0dc8a65af0d","bs":true}'
*/
```

## References
- Spec: https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf
- Overview: https://www.youtube.com/watch?v=sWuQ3RZ6R5w&list=PLVztGGxiGfIhBmyFhixteZKJvWC3KlaSf&index=5

## Docs
https://littlespex.github.io/cmcd-ts/
