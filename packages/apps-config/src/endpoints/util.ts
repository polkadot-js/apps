// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption, LinkOption } from './types';

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

export function expandEndpoint (t: TFunction, { allowTeleport, dnslink, genesisHash, info, isChild, isDisabled, linked, paraId, providers, text }: EndpointOption): LinkOption[] {
  const base = {
    allowTeleport,
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
    isRelay: false,
    textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host } }),
    value
  }));

  if (linked) {
    const last = result[result.length - 1];
    const options: LinkOption[] = [];

    linked.forEach((o) => options.push(...expandEndpoint(t, o)));
    last.isRelay = true;
    last.linked = options;

    // if one of the children allows teleport, add it to the root as well
    const allowTeleport = options.some(({ allowTeleport }) => allowTeleport);

    result.forEach((r): void => {
      r.allowTeleport = allowTeleport;
    });
  }

  return expandLinked(result);
}

export function expandEndpoints (t: TFunction, input: EndpointOption[]): LinkOption[] {
  return input.reduce((result: LinkOption[], input) => result.concat(expandEndpoint(t, input)), []);
}
