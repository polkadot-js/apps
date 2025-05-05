// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { KeyringOptions } from '@polkadot/ui-keyring/options/types';

import React, { useEffect } from 'react';

import { Status as StatusDisplay } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useQueue } from '@polkadot/react-hooks';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate.js';

interface Props {
  optionsAll?: KeyringOptions;
}

let prevEventHash: string;

function filterEvents (allAccounts: string[], t: (key: string, options?: { replace: Record<string, unknown> }) => string, optionsAll?: KeyringOptions, events?: EventRecord[]): ActionStatus[] | null {
  const eventHash = xxhashAsHex(stringToU8a(JSON.stringify(events)));

  if (!optionsAll || !events || eventHash === prevEventHash) {
    return null;
  }

  prevEventHash = eventHash;

  return events
    .map(({ event: { data, method, section } }): ActionStatus | null => {
      if (section === 'balances' && method === 'Transfer') {
        const account = data[1].toString();

        if (allAccounts.includes(account)) {
          return {
            account,
            action: `${section}.${method}`,
            message: t('transfer received'),
            status: 'event'
          };
        }
      } else if (section === 'democracy') {
        const index = data[0].toString();

        return {
          action: `${section}.${method}`,
          message: t('update on #{{index}}', {
            replace: {
              index
            }
          }),
          status: 'event'
        };
      }

      return null;
    })
    .filter((item): item is ActionStatus => !!item);
}

function Status ({ optionsAll }: Props): React.ReactElement<Props> {
  const { queueAction } = useQueue();
  const { api, isApiReady } = useApi();
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const events = useCall<EventRecord[]>(isApiReady && api.query.system?.events);

  useEffect((): void => {
    const filtered = filterEvents(allAccounts, t, optionsAll, events);

    filtered && queueAction(filtered);
  }, [allAccounts, events, optionsAll, queueAction, t]);

  return (
    <StatusDisplay />
  );
}

export default React.memo(Status);
