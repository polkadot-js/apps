/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types/interfaces';
import { KeyringOptions } from '@polkadot/ui-keyring/options/types';
import { ActionStatus, QueueStatus, QueueTx, QueueAction$Add } from '@polkadot/react-components/Status/types';

import React, { useEffect } from 'react';
import { Status as StatusDisplay } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
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

export default function Status ({ optionsAll, queueAction, stqueue, txqueue }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const events = useCall<EventRecord[]>(isApiReady ? api.query.system?.events : undefined, []);

  useEffect((): void => {
    const eventHash = xxhashAsHex(stringToU8a(JSON.stringify(events)));

    if (!optionsAll || eventHash === prevEventHash) {
      return;
    }

    prevEventHash = eventHash;

    const statusses = events && events
      .map(({ event: { data, method, section } }): ActionStatus | null => {
        if (section === 'balances' && method === 'Transfer') {
          const account = data[1].toString();

          if (allAccounts.includes(account)) {
            return {
              account,
              action: `${section}.${method}`,
              status: 'event',
              message: t('transfer received')
            };
          }
        } else if (section === 'democracy') {
          const index = data[0].toString();

          return {
            action: `${section}.${method}`,
            status: 'event',
            message: t('update on #{{index}}', {
              replace: {
                index
              }
            })
          };
        }

        return null;
      })
      .filter((item): boolean => !!item) as ActionStatus[];

    statusses && statusses.length && queueAction(statusses);
  }, [events]);

  return (
    <StatusDisplay
      stqueue={stqueue}
      txqueue={txqueue}
    />
  );
}
