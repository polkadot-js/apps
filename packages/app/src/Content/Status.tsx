// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Status as StatusDisplay } from '@canvas-ui/react-components';
import { ActionStatus, QueueAction$Add, QueueStatus, QueueTx } from '@canvas-ui/react-api/Status/types';
import { useAccounts, useApi, useCall } from '@canvas-ui/react-hooks';
import React, { useEffect } from 'react';

import { EventRecord } from '@polkadot/types/interfaces';
import { KeyringOptions } from '@polkadot/ui-keyring/options/types';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';

interface Props {
  optionsAll?: KeyringOptions;
  queueAction: QueueAction$Add;
  stqueue: QueueStatus[];
  txqueue: QueueTx[];
}

let prevEventHash: string;

function filterEvents (allAccounts: string[], t: <T = string> (key: string, opts?: Record<string, unknown>) => T, optionsAll?: KeyringOptions, events?: EventRecord[]): ActionStatus[] | null {
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
            message: t<string>('transfer received'),
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

function Status ({ optionsAll, queueAction, stqueue, txqueue }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const events = useCall<EventRecord[]>(isApiReady && api.query.system?.events, []);

  useEffect((): void => {
    const filtered = filterEvents(allAccounts, t, optionsAll, events);

    filtered && queueAction(filtered);
  }, [allAccounts, events, optionsAll, queueAction, t]);

  return (
    <StatusDisplay
      stqueue={stqueue}
      txqueue={txqueue}
    />
  );
}

export default React.memo(Status);
