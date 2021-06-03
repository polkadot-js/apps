// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';
import type { EndpointOption } from './types';

import { EndpointType } from './types';

export function expandLinked (input: LinkOption[]): LinkOption[] {
  return input.reduce((result: LinkOption[], entry): LinkOption[] => {
    result.push(entry);

    return entry.linked
      ? result.concat(
        expandLinked(entry.linked).map((child): LinkOption => {
          child.genesisHashRelay = entry.genesisHash;
          child.isChild = true;

          return child;
        })
      )
      : result;
  }, []);
}

export function expandEndpoint (t: TFunction, input: EndpointOption): LinkOption[] {
  const { dnslink, genesisHash, info, isChild, isDisabled, linked, paraId, providers, text } = input;
  const base = {
    genesisHash,
    info,
    isChild,
    isDisabled,
    paraId,
    text
  };

  const result = Object.entries(providers).map(([host, value], index): LinkOption => ({
    ...base,
    dnslink: index === 0 ? dnslink : undefined,
    isLightClient: value.type === EndpointType.substrateconnect,
    textBy: (value.type === EndpointType.jrpc)
      ? t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host } })
      : t('lightclient.experimental', 'light client (experimental)', { ns: 'apps-config' }),
    value: (value.type === EndpointType.jrpc) ? value.url : value.chain
  }));

  if (linked) {
    const last = result[result.length - 1];
    const options: LinkOption[] = [];

    linked.forEach((o) => options.push(...expandEndpoint(t, o)));
    last.linked = options;
  }

  return expandLinked(result);
}

export function expandEndpoints (t: TFunction, input: EndpointOption[]): LinkOption[] {
  return input.reduce((result: LinkOption[], input) => result.concat(expandEndpoint(t, input)), []);
}
