import { CmcdObjectType } from './CmcdObjectType';
import { CmcdStreamingFormat } from './CmcdStreamingFormat';
import { CmcdStreamType } from './CmcdStreamType';

export type CmcdValue = CmcdObjectType | CmcdStreamingFormat | CmcdStreamType | string | number | boolean | symbol | undefined;
