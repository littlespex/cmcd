# cmcd.js
CMCD (Common Media Client Data) library with Typescript definitions.

## Install
```shell
npm i cmcd.js
```

## Usage
All CMCD properties are optional. Properties that are with nullish values will not be serialized.

```typescript
import {
  Cmcd,
  CmcdObjectType,
  CmcdStreamingFormat,
  CmcdStreamType,
  toHeaders,
  toJson,
  toQuery
} from 'cmcd.js';

const data: Cmcd = {
  cid: '9f7f349b-baba-43d7-bbe7-b0dc8a65af0d',
  sf: CmcdStreamingFormat.DASH,
  st: CmcdStreamType.VOD,
  su: false,
  mtp: 10000,
  bs: true,
  br: 200,
  ot: CmcdObjectType.MANIFEST,
};

const query = toQuery(data);
console.log(query);
/* 
'CMCD=br%3D200%2Cbs%2Cmtp%3D10000%2Cot%3Dm%2Csf%3Dd%2Ccid%3D%229f7f349b-baba-43d7-bbe7-b0dc8a65af0d%22%2Cst%3Dv'
*/

const headers = toHeaders(data);
console.log(headers);
/*
{
  'cmcd-request': 'mtp=10000',
  'cmcd-object': 'br=200,ot=m',
  'cmcd-session': 'sf=d,cid="9f7f349b-baba-43d7-bbe7-b0dc8a65af0d",st=v',
  'cmcd-status': 'bs',
}
*/

const json = toJson(data);
console.log(json);
/*
'{"mtp":10000,"su":false,"br":200,"ot":"m","sf":"d","cid":"9f7f349b-baba-43d7-bbe7-b0dc8a65af0d","st":"v","bs":true}'
*/
```

## API Docs
https://littlespex.github.io/cmcd.js/

## References
- Spec: https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf
- Overview: https://www.youtube.com/watch?v=sWuQ3RZ6R5w&list=PLVztGGxiGfIhBmyFhixteZKJvWC3KlaSf&index=5
