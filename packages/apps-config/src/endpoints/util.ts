// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '../settings/types';
import type { EndpointOption } from './types';

export function expandLinked (input: LinkOption[]): LinkOption[] {
  return input.reduce((result: LinkOption[], entry): LinkOption[] => {
    result.push(entry);

    return entry.linked
      ? result.concat(
        expandLinked(entry.linked).map((entry): LinkOption => {
          entry.isChild = true;

          return entry;
        })
      )
      : result;
  }, []);
}

export function expandEndpoint (input: EndpointOption): LinkOption[] {
  const { dnslink, info, isChild, isDisabled, linked, providers, text } = input;
  const base = {
    info,
    isChild,
    isDisabled,
    text
  };

  const result = providers.map(({ by, url }, index): LinkOption => ({
    ...base,
    dnslink: index === 0 ? dnslink : undefined,
    textBy: by,
    value: url
  }));

  if (linked) {
    const last = result[result.length - 1];
    const options: LinkOption[] = [];

    linked.forEach((o) => options.push(...expandEndpoint(o)));
    last.linked = options;
  }

  return expandLinked(result);
}
