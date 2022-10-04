// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { EndpointOption, LinkOption } from './types';

interface SortOption {
  isUnreachable?: boolean;
}

let dummyId = 0;

function sortNoop (): number {
  return 0;
}

function sortLinks (a: SortOption, b: SortOption): number {
  return !!a.isUnreachable !== !!b.isUnreachable
    ? a.isUnreachable
      ? 1
      : -1
    : 0;
}

function expandLinked (input: LinkOption[]): LinkOption[] {
  const valueRelay = input.map(({ value }) => value);

  return input.reduce((result: LinkOption[], entry): LinkOption[] => {
    result.push(entry);

    return entry.linked
      ? result.concat(
        expandLinked(entry.linked).map((child): LinkOption => {
          child.genesisHashRelay = entry.genesisHash;
          child.isChild = true;
          child.textRelay = input.length
            ? input[0].text
            : undefined;
          child.valueRelay = valueRelay;

          return child;
        })
      )
      : result;
  }, []);
}

function expandEndpoint (t: TFunction, { dnslink, genesisHash, homepage, info, isChild, isDisabled, isUnreachable, linked, paraId, providers, teleport, text }: EndpointOption, firstOnly: boolean, withSort: boolean): LinkOption[] {
  const hasProviders = Object.keys(providers).length !== 0;
  const base = {
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isUnreachable: isUnreachable || !hasProviders,
    paraId,
    teleport,
    text
  };

  const result = Object
    .entries(
      hasProviders
        ? providers
        : { Placeholder: `wss://${++dummyId}` }
    )
    .filter((_, index) => !firstOnly || index === 0)
    .map(([host, value], index): LinkOption => ({
      ...base,
      dnslink: index === 0 ? dnslink : undefined,
      isLightClient: value.startsWith('light://'),
      isRelay: false,
      textBy: value.startsWith('light://')
        ? t('lightclient.experimental', 'light client (experimental)', { ns: 'apps-config' })
        : t('rpc.hosted.via', 'via {{host}}', { ns: 'apps-config', replace: { host } }),
      value
    }))
    .sort((a, b) =>
      a.isLightClient
        ? 1
        : b.isLightClient
          ? -1
          : 0
    );

  if (linked) {
    const last = result[result.length - 1];
    const options: LinkOption[] = [];

    linked
      .sort(withSort ? sortLinks : sortNoop)
      .filter(({ paraId }) => paraId)
      .forEach((o) =>
        options.push(...expandEndpoint(t, o, firstOnly, withSort))
      );

    last.isRelay = true;
    last.linked = options;
  }

  return expandLinked(result);
}

export function expandEndpoints (t: TFunction, input: EndpointOption[], firstOnly: boolean, withSort: boolean): LinkOption[] {
  return input
    .sort(withSort ? sortLinks : sortNoop)
    .reduce((all: LinkOption[], e) =>
      all.concat(expandEndpoint(t, e, firstOnly, withSort)), []);
}
