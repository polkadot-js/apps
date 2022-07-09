// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isString } from '@polkadot/util';

import { createWsEndpoints } from '../endpoints';
import { checkEndpoint } from './check';

interface Endpoint {
  name: string;
  ws: string;
}

export function checkEndpoints (issueFile: string, failures: string[]): void {
  const checker = checkEndpoint(issueFile, failures);

  it.each(
    createWsEndpoints()
      .filter(({ isDisabled, isUnreachable, value }) =>
        !isDisabled &&
        !isUnreachable &&
        value &&
        isString(value) &&
        !value.includes('127.0.0.1') &&
        !value.startsWith('light://')
      )
      .map(({ text, value }): Partial<Endpoint> => ({
        name: text as string,
        ws: value
      }))
      .filter((v): v is Endpoint => !!v.ws)
  )('%name @ %$ws', ({ name, ws }): Promise<void> => {
    console.error(`>>> ${name} @ ${ws}`);

    return checker(name, ws).then((r) => expect(r).toBe(true));
  });
}
