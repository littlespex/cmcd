# cmcd-ts
CMCD (Common Media Client Data) Typescript definitions.

## Install
```shell
npm i cmcd-ts
```

## Usage
The top level `Cmcd` object contains references to all the CMCD data properties. Properties that are not filled out, or have `null` or `undefined` values, will not be serialized.

```typescript
import {
  Cmcd,
  CmcdObjectType,
  CmcdStreamingFormat,
  CmcdStreamType,
  toHeaders,
  toJson,
  toQuery
} from 'cmcd-ts';

const data = new Cmcd();
data.sid = '9f7f349b-baba-43d7-bbe7-b0dc8a65af0d';
data.sf = CmcdStreamingFormat.DASH;
data.st = CmcdStreamType.VOD;
data.su = false;
data.mtp = 10000;
data.bs = true;
data.br = 200;
data.ot = CmcdObjectType.MANIFEST;

const query = toQuery(data);
console.log(query);
/* 
'CMCD=br%3D200%2Cbs%2Cmtp%3D10000%2Cot%3Dm%2Csf%3Dd%2Csid%3D%229f7f349b-baba-43d7-bbe7-b0dc8a65af0d%22%2Cst%3Dv'
*/

const headers = toHeaders(data);
console.log(headers);
/*
{
  'cmcd-request': 'mtp=10000',
  'cmcd-object': 'br=200,ot=m',
  'cmcd-session': 'sf=d,sid="9f7f349b-baba-43d7-bbe7-b0dc8a65af0d",st=v',
  'cmcd-status': 'bs',
}
*/

const json = toJson(data);
console.log(json);
/*
'{"mtp":10000,"su":false,"br":200,"ot":"m","sf":"d","sid":"9f7f349b-baba-43d7-bbe7-b0dc8a65af0d","st":"v","bs":true}'
*/
```

## References
- Spec: https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf
- Overview: https://www.youtube.com/watch?v=sWuQ3RZ6R5w&list=PLVztGGxiGfIhBmyFhixteZKJvWC3KlaSf&index=5

## Docs
https://littlespex.github.io/cmcd-ts/
