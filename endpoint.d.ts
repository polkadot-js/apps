import type { ApiPromise } from '@polkadot/api';
export declare function findMissingApis(api: ApiPromise, needsApi?: (string | string[])[], needsApiInstances?: boolean, needsApiCheck?: (api: ApiPromise) => boolean): (string | string[])[];
