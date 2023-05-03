> **Warning**
> This repository has been archived. Please use [@svta.org/common-media-library](https://github.com/streaming-video-technology-alliance/common-media-library).

# cmcd.js
CMCD (Common Media Client Data) library with Typescript definitions.

## Install
```shell
npm i cmcd.js
```

## Usage
All CMCD properties are optional. Properties that with nullish values will not be serialized.

```typescript
import {
  Cmcd,
  CmcdHeader,
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
'CMCD=br%3D200%2Cbs%2Ccid%3D%229f7f349b-baba-43d7-bbe7-b0dc8a65af0d%22%2Cmtp%3D10000%2Cot%3Dm%2Csf%3Dd%2Cst%3Dv'
*/

const headers = toHeaders(data);
console.log(headers);
/*
{
  'CMCD-Object': 'br=200,ot=m',
  'CMCD-Request': 'mtp=10000',
  'CMCD-Session': 'cid="9f7f349b-baba-43d7-bbe7-b0dc8a65af0d",sf=d,st=v',
  'CMCD-Status': 'bs'
}
*/

const json = toJson(data);
console.log(json);
/*
'{"br":200,"bs":true,"cid":"9f7f349b-baba-43d7-bbe7-b0dc8a65af0d","mtp":10000,"ot":"m","sf":"d","st":"v"}'
*/

/**
 * Custom Fields 
 */

data['com.example-a'] = 'hello';
data['com.example-b'] = 1234;
data['com.example-c'] = true;
data['com.example-d'] = Symbol('s');

console.log(toQuery(data));
/*
'CMCD=br%3D200%2Cbs%2Ccid%3D%229f7f349b-baba-43d7-bbe7-b0dc8a65af0d%22%2Ccom.example-a%3D%22hello%22%2Ccom.example-b%3D1234%2Ccom.example-c%2Ccom.example-d%3Ds%2Cmtp%3D10000%2Cot%3Dm%2Csf%3Dd%2Cst%3Dv'
*/

/**
 * Custom fields can be mapped to specific headers by providing a mapping 
 * object to the `toHeader` function. Unmapped custom fields are added to 
 * the CMCD-Request header.
 */
const headerMap = {
  ['com.example-a']: CmcdHeader.Object,
  ['com.example-b']: CmcdHeader.Session,
  ['com.example-c']: CmcdHeader.Status,
};

console.log(toHeaders(data, headerMap));
/*
{
  'CMCD-Object': 'br=200,com.example-a="hello",ot=m',
  'CMCD-Request': 'com.example-d=s,mtp=10000',
  'CMCD-Session': 'cid="9f7f349b-baba-43d7-bbe7-b0dc8a65af0d",com.example-b=1234,sf=d,st=v',
  'CMCD-Status': 'bs,com.example-c'
}
*/
```

## API Docs
https://littlespex.github.io/cmcd.js/

## References
- Spec: https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf
- Overview: https://www.youtube.com/watch?v=sWuQ3RZ6R5w&list=PLVztGGxiGfIhBmyFhixteZKJvWC3KlaSf&index=5
