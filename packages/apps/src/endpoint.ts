// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { isFunction, isObject } from '@polkadot/util';

type ApiMapper = Record<string, Record<string, Record<string, unknown>>>;

function hasEndpoint (api: ApiPromise, endpoint: string, needsApiInstances: boolean): boolean {
  const [area, _section, method] = endpoint.split('.');
  const [section] = (needsApiInstances && api.registry.getModuleInstances(api.runtimeVersion.specName.toString(), _section)) || [_section];
  const resolvedSection = (api as unknown as ApiMapper)[area][section]
    ? section
    : _section;

  try {
    return area === 'consts'
      ? isObject((api as unknown as ApiMapper)[area][resolvedSection][method])
      : isFunction((api as unknown as ApiMapper)[area][resolvedSection][method]);
  } catch {
    return false;
  }
}

export function findMissingApis (api: ApiPromise, needsApi?: (string | string[])[], needsApiInstances = false, needsApiCheck?: (api: ApiPromise) => boolean): (string | string[])[] {
  if (!needsApi) {
    return [];
  }

  const missing = needsApi.filter((endpoint: string | string[]): boolean => {
    const hasApi = Array.isArray(endpoint)
      ? endpoint.reduce((hasApi, endpoint) => hasApi || hasEndpoint(api, endpoint, needsApiInstances), false)
      : hasEndpoint(api, endpoint, needsApiInstances);

    return !hasApi;
  });

  if (!missing.length && needsApiCheck && !needsApiCheck(api)) {
    return ['needsApiCheck'];
  }

  return missing;
}
