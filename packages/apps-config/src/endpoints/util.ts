// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption, LinkOption } from './types';

interface SortOption {
  isUnreachable?: boolean;
}

function sortLinks (a: SortOption, b: SortOption): number {
  return a.isUnreachable !== b.isUnreachable
    ? a.isUnreachable
      ? 1
      : -1
    : 0;
}

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

export function expandEndpoint (t: TFunction, { dnslink, genesisHash, homepage, info, isChild, isDisabled, isUnreachable, linked, paraId, providers, teleport, text }: EndpointOption, firstOnly?: boolean): LinkOption[] {
  const base = {
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isUnreachable,
    paraId,
    teleport,
    text
  };

  const result = Object
    .entries(providers)
    .filter((_, index) => !firstOnly || index === 0)
    .map(([host, value], index): LinkOption => ({
      ...base,
      dnslink: index === 0 ? dnslink : undefined,
      isLightClient: value.startsWith('light://'),
      isRelay: false,
      textBy: value.startsWith('light://')
        ? t('lightclient.experimental', 'light client (experimental)', { ns: 'apps-config' })
        : t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host } }),
      value
    }));

  if (linked) {
    const last = result[result.length - 1];
    const options: LinkOption[] = [];

    linked
      .sort(sortLinks)
      .filter(({ paraId }) => paraId)
      .forEach((o) =>
        options.push(...expandEndpoint(t, o, firstOnly))
      );

    last.isRelay = true;
    last.linked = options;
  }

  return expandLinked(result);
}

export function expandEndpoints (t: TFunction, input: EndpointOption[], firstOnly?: boolean): LinkOption[] {
  return input.sort(sortLinks).reduce((result: LinkOption[], input) => result.concat(expandEndpoint(t, input, firstOnly)), []);
}
