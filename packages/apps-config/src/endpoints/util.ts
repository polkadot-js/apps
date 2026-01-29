// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types.js';
import type { EndpointOption, LinkOption } from './types.js';

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

          if (entry.ui?.identityIcon && child.paraId && child.paraId < 2000) {
            if (!child.ui) {
              child.ui = { identityIcon: entry.ui.identityIcon };
            } else if (!child.ui.identityIcon) {
              child.ui.identityIcon = entry.ui.identityIcon;
            }
          }

          return child;
        })
      )
      : result;
  }, []);
}

function expandEndpoint (t: TFunction, { dnslink, genesisHash, homepage, info, isChild, isDisabled, isPeople, isPeopleForIdentity, isUnreachable, linked, paraId, providers, relayName, teleport, text, ui }: EndpointOption, firstOnly: boolean, withSort: boolean): LinkOption[] {
  const hasProviders = Object.keys(providers).length !== 0;
  const base = {
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isPeople,
    isPeopleForIdentity,
    isUnreachable: isUnreachable || !hasProviders,
    paraId,
    providers: Object.keys(providers).map((k) => providers[k]),
    relayName,
    teleport,
    text,
    ui
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
          : a.textBy.toLocaleLowerCase().localeCompare(b.textBy.toLocaleLowerCase())
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

export function getTeleports (input: EndpointOption[]): number[] {
  return input
    .filter(({ teleport }) => !!teleport && teleport[0] === -1)
    .map(({ paraId }) => paraId)
    .filter((id): id is number => !!id);
}
